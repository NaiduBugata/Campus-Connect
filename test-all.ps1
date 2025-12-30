$backend = "https://campus-connect-ygl9.onrender.com/api"
$totalPassed = 0
$totalTests = 0
$results = @()

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     COMPREHENSIVE SYSTEM TEST - CAMPUS CONNECT             ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# SECTION 1: INFRASTRUCTURE
Write-Host "═══ SECTION 1: INFRASTRUCTURE (3 tests) ═══`n" -ForegroundColor Yellow
$sectionPassed = 0

# Test 1: Health
$totalTests++
Write-Host "Test 1 - Health Endpoint" -ForegroundColor White
try {
    $r = Invoke-WebRequest -Uri "$backend/health" -UseBasicParsing -TimeoutSec 10
    $d = $r.Content | ConvertFrom-Json
    if ($d.success) {
        Write-Host "  ✅ PASS - Version: $($d.version)`n" -ForegroundColor Green
        $sectionPassed++
        $totalPassed++
        $results += @{Test="Health Check"; Status="✅ PASS"}
    }
} catch {
    Write-Host "  ❌ FAIL`n" -ForegroundColor Red
    $results += @{Test="Health Check"; Status="❌ FAIL"}
}

# Test 2: Database
$totalTests++
Write-Host "Test 2 - Database Connection" -ForegroundColor White
try {
    $r = Invoke-WebRequest -Uri "$backend/db-test" -UseBasicParsing -TimeoutSec 10
    $d = $r.Content | ConvertFrom-Json
    if ($d.dbState -eq 1) {
        Write-Host "  ✅ PASS - MongoDB: $($d.dbHost)`n" -ForegroundColor Green
        $sectionPassed++
        $totalPassed++
        $results += @{Test="DB Connection"; Status="✅ PASS"}
    }
} catch {
    Write-Host "  ❌ FAIL`n" -ForegroundColor Red
    $results += @{Test="DB Connection"; Status="❌ FAIL"}
}

# Test 3: Webpushr
$totalTests++
Write-Host "Test 3 - Webpushr Configuration" -ForegroundColor White
try {
    $r = Invoke-WebRequest -Uri "$backend/webpushr-test" -UseBasicParsing -TimeoutSec 10
    $d = $r.Content | ConvertFrom-Json
    if ($d.success) {
        Write-Host "  ✅ PASS`n" -ForegroundColor Green
        $sectionPassed++
        $totalPassed++
        $results += @{Test="Webpushr Config"; Status="✅ PASS"}
    }
} catch {
    Write-Host "  ❌ FAIL`n" -ForegroundColor Red
    $results += @{Test="Webpushr Config"; Status="❌ FAIL"}
}

Write-Host "Section 1 Score: $sectionPassed/3`n" -ForegroundColor Cyan

# SECTION 2: AUTHENTICATION
Write-Host "═══ SECTION 2: AUTHENTICATION (4 tests) ═══`n" -ForegroundColor Yellow
$sectionPassed = 0

# Test 4: Valid Login
$totalTests++
Write-Host "Test 4 - Admin Login (Valid)" -ForegroundColor White
try {
    $body = @{ username = "admin"; password = "admin123" } | ConvertTo-Json
    $r = Invoke-WebRequest -Uri "$backend/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    $d = $r.Content | ConvertFrom-Json
    if ($d.success -and $d.token) {
        $global:validToken = $d.token
        Write-Host "  ✅ PASS - Token received`n" -ForegroundColor Green
        $sectionPassed++
        $totalPassed++
        $results += @{Test="Valid Login"; Status="✅ PASS"}
    }
} catch {
    Write-Host "  ❌ FAIL`n" -ForegroundColor Red
    $results += @{Test="Valid Login"; Status="❌ FAIL"}
}

# Test 5: Invalid Login
$totalTests++
Write-Host "Test 5 - Admin Login (Invalid)" -ForegroundColor White
try {
    $body = @{ username = "admin"; password = "wrong" } | ConvertTo-Json
    Invoke-WebRequest -Uri "$backend/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing -ErrorAction Stop | Out-Null
    Write-Host "  ❌ FAIL - Should reject`n" -ForegroundColor Red
    $results += @{Test="Invalid Login Reject"; Status="❌ FAIL"}
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "  ✅ PASS - Rejected with 401`n" -ForegroundColor Green
        $sectionPassed++
        $totalPassed++
        $results += @{Test="Invalid Login Reject"; Status="✅ PASS"}
    }
}

# Test 6: Valid Token
$totalTests++
Write-Host "Test 6 - Token Validation (Valid)" -ForegroundColor White
try {
    $headers = @{ Authorization = "Bearer $global:validToken" }
    $r = Invoke-WebRequest -Uri "$backend/notifications/stats" -Headers $headers -UseBasicParsing
    if ($r.StatusCode -eq 200) {
        Write-Host "  ✅ PASS`n" -ForegroundColor Green
        $sectionPassed++
        $totalPassed++
        $results += @{Test="Valid Token"; Status="✅ PASS"}
    }
} catch {
    Write-Host "  ❌ FAIL`n" -ForegroundColor Red
    $results += @{Test="Valid Token"; Status="❌ FAIL"}
}

# Test 7: Invalid Token
$totalTests++
Write-Host "Test 7 - Token Validation (Invalid)" -ForegroundColor White
try {
    $headers = @{ Authorization = "Bearer invalid123" }
    Invoke-WebRequest -Uri "$backend/notifications/stats" -Headers $headers -UseBasicParsing -ErrorAction Stop | Out-Null
    Write-Host "  ❌ FAIL - Should reject`n" -ForegroundColor Red
    $results += @{Test="Invalid Token Reject"; Status="❌ FAIL"}
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "  ✅ PASS - Rejected with 401`n" -ForegroundColor Green
        $sectionPassed++
        $totalPassed++
        $results += @{Test="Invalid Token Reject"; Status="✅ PASS"}
    }
}

Write-Host "Section 2 Score: $sectionPassed/4`n" -ForegroundColor Cyan

# SECTION 3: NOTIFICATION CRUD
Write-Host "═══ SECTION 3: NOTIFICATION CRUD (6 tests) ═══`n" -ForegroundColor Yellow
$sectionPassed = 0

# Test 8: Get All Notifications
$totalTests++
Write-Host "Test 8 - Get All Notifications" -ForegroundColor White
try {
    $headers = @{ Authorization = "Bearer $global:validToken" }
    $r = Invoke-WebRequest -Uri "$backend/notifications" -Headers $headers -UseBasicParsing
    $d = $r.Content | ConvertFrom-Json
    if ($d.success) {
        Write-Host "  ✅ PASS - Count: $($d.count)`n" -ForegroundColor Green
        $sectionPassed++
        $totalPassed++
        $results += @{Test="Get Notifications"; Status="✅ PASS"; Details="Count: $($d.count)"}
    }
} catch {
    Write-Host "  ❌ FAIL`n" -ForegroundColor Red
    $results += @{Test="Get Notifications"; Status="❌ FAIL"}
}

# Test 9: Get Stats
$totalTests++
Write-Host "Test 9 - Get Dashboard Stats" -ForegroundColor White
try {
    $headers = @{ Authorization = "Bearer $global:validToken" }
    $r = Invoke-WebRequest -Uri "$backend/notifications/stats" -Headers $headers -UseBasicParsing
    $d = $r.Content | ConvertFrom-Json
    if ($d.success) {
        Write-Host "  ✅ PASS - Total: $($d.stats.total), Read: $($d.stats.read)`n" -ForegroundColor Green
        $sectionPassed++
        $totalPassed++
        $results += @{Test="Get Stats"; Status="✅ PASS"; Details="Total: $($d.stats.total)"}
    }
} catch {
    Write-Host "  ❌ FAIL`n" -ForegroundColor Red
    $results += @{Test="Get Stats"; Status="❌ FAIL"}
}

# Test 10: Create Notification
$totalTests++
Write-Host "Test 10 - Create Notification" -ForegroundColor White
try {
    $headers = @{ Authorization = "Bearer $global:validToken" }
    $timestamp = Get-Date -Format "HH:mm:ss"
    $body = @{
        title = "System Test $timestamp"
        message = "Automated test notification"
        status = "active"
    } | ConvertTo-Json
    $r = Invoke-WebRequest -Uri "$backend/notifications" -Method POST -Headers $headers -Body $body -ContentType "application/json" -UseBasicParsing
    $d = $r.Content | ConvertFrom-Json
    if ($d.success -and $d.data.notification_id) {
        $global:testNotifId = $d.data.notification_id
        Write-Host "  ✅ PASS - ID: $global:testNotifId`n" -ForegroundColor Green
        $sectionPassed++
        $totalPassed++
        $results += @{Test="Create Notification"; Status="✅ PASS"; Details="ID: $global:testNotifId"}
    }
} catch {
    Write-Host "  ❌ FAIL`n" -ForegroundColor Red
    $results += @{Test="Create Notification"; Status="❌ FAIL"}
}

# Test 11: Get By ID
$totalTests++
Write-Host "Test 11 - Get Notification By ID" -ForegroundColor White
try {
    $headers = @{ Authorization = "Bearer $global:validToken" }
    $r = Invoke-WebRequest -Uri "$backend/notifications/by-id/$global:testNotifId" -Headers $headers -UseBasicParsing
    $d = $r.Content | ConvertFrom-Json
    if ($d.success) {
        Write-Host "  ✅ PASS - Found notification`n" -ForegroundColor Green
        $sectionPassed++
        $totalPassed++
        $results += @{Test="Get By ID"; Status="✅ PASS"}
    }
} catch {
    Write-Host "  ❌ FAIL`n" -ForegroundColor Red
    $results += @{Test="Get By ID"; Status="❌ FAIL"}
}

# Test 12: Mark as Read
$totalTests++
Write-Host "Test 12 - Mark Notification as Read" -ForegroundColor White
try {
    $headers = @{ Authorization = "Bearer $global:validToken" }
    $r = Invoke-WebRequest -Uri "$backend/notifications/$global:testNotifId/read" -Method PUT -Headers $headers -UseBasicParsing
    $d = $r.Content | ConvertFrom-Json
    if ($d.success -and $d.data.readStatus -eq "READ") {
        Write-Host "  ✅ PASS - Status: READ`n" -ForegroundColor Green
        $sectionPassed++
        $totalPassed++
        $results += @{Test="Mark as Read"; Status="✅ PASS"}
    }
} catch {
    Write-Host "  ❌ FAIL`n" -ForegroundColor Red
    $results += @{Test="Mark as Read"; Status="❌ FAIL"}
}

# Test 13: Resend Check
$totalTests++
Write-Host "Test 13 - Resend Check Logic" -ForegroundColor White
try {
    $headers = @{ Authorization = "Bearer $global:validToken" }
    $r = Invoke-WebRequest -Uri "$backend/notifications/resend-check" -Method POST -Headers $headers -UseBasicParsing
    $d = $r.Content | ConvertFrom-Json
    if ($d.success) {
        Write-Host "  ✅ PASS - Checked: $($d.data.total_checked)`n" -ForegroundColor Green
        $sectionPassed++
        $totalPassed++
        $results += @{Test="Resend Check"; Status="✅ PASS"}
    }
} catch {
    Write-Host "  ❌ FAIL`n" -ForegroundColor Red
    $results += @{Test="Resend Check"; Status="❌ FAIL"}
}

Write-Host "Section 3 Score: $sectionPassed/6`n" -ForegroundColor Cyan

# SECTION 4: EVENTS
Write-Host "═══ SECTION 4: EVENT MANAGEMENT (2 tests) ═══`n" -ForegroundColor Yellow
$sectionPassed = 0

# Test 14: Get Events
$totalTests++
Write-Host "Test 14 - Get All Events" -ForegroundColor White
try {
    $headers = @{ Authorization = "Bearer $global:validToken" }
    $r = Invoke-WebRequest -Uri "$backend/events" -Headers $headers -UseBasicParsing
    $d = $r.Content | ConvertFrom-Json
    if ($d.success) {
        Write-Host "  ✅ PASS - Events: $($d.count)`n" -ForegroundColor Green
        $sectionPassed++
        $totalPassed++
        $results += @{Test="Get Events"; Status="✅ PASS"; Details="Count: $($d.count)"}
    }
} catch {
    Write-Host "  ❌ FAIL`n" -ForegroundColor Red
    $results += @{Test="Get Events"; Status="❌ FAIL"}
}

# Test 15: Create Event
$totalTests++
Write-Host "Test 15 - Create Event" -ForegroundColor White
try {
    $headers = @{ Authorization = "Bearer $global:validToken" }
    $body = @{
        title = "Test Event"
        description = "Automated test"
        date = "2025-12-31"
        venue = "Test Hall"
        category = "other"
    } | ConvertTo-Json
    $r = Invoke-WebRequest -Uri "$backend/events" -Method POST -Headers $headers -Body $body -ContentType "application/json" -UseBasicParsing
    $d = $r.Content | ConvertFrom-Json
    if ($d.success) {
        $global:testEventId = $d.data._id
        Write-Host "  ✅ PASS - Event created`n" -ForegroundColor Green
        $sectionPassed++
        $totalPassed++
        $results += @{Test="Create Event"; Status="✅ PASS"}
    }
} catch {
    Write-Host "  ❌ FAIL`n" -ForegroundColor Red
    $results += @{Test="Create Event"; Status="❌ FAIL"}
}

Write-Host "Section 4 Score: $sectionPassed/2`n" -ForegroundColor Cyan

# SECTION 5: SUBSCRIBERS
Write-Host "═══ SECTION 5: SUBSCRIBERS (2 tests) ═══`n" -ForegroundColor Yellow
$sectionPassed = 0

# Test 16: Get Subscribers
$totalTests++
Write-Host "Test 16 - Get All Subscribers" -ForegroundColor White
try {
    $headers = @{ Authorization = "Bearer $global:validToken" }
    $r = Invoke-WebRequest -Uri "$backend/subscribers" -Headers $headers -UseBasicParsing
    $d = $r.Content | ConvertFrom-Json
    if ($d.success) {
        Write-Host "  ✅ PASS - Subscribers: $($d.count)`n" -ForegroundColor Green
        $sectionPassed++
        $totalPassed++
        $results += @{Test="Get Subscribers"; Status="✅ PASS"; Details="Count: $($d.count)"}
    }
} catch {
    Write-Host "  ❌ FAIL`n" -ForegroundColor Red
    $results += @{Test="Get Subscribers"; Status="❌ FAIL"}
}

# Test 17: Subscriber Stats
$totalTests++
Write-Host "Test 17 - Get Subscriber Stats" -ForegroundColor White
try {
    $headers = @{ Authorization = "Bearer $global:validToken" }
    $r = Invoke-WebRequest -Uri "$backend/subscribers/stats" -Headers $headers -UseBasicParsing
    $d = $r.Content | ConvertFrom-Json
    if ($d.success) {
        Write-Host "  ✅ PASS`n" -ForegroundColor Green
        $sectionPassed++
        $totalPassed++
        $results += @{Test="Subscriber Stats"; Status="✅ PASS"}
    }
} catch {
    Write-Host "  ❌ FAIL`n" -ForegroundColor Red
    $results += @{Test="Subscriber Stats"; Status="❌ FAIL"}
}

Write-Host "Section 5 Score: $sectionPassed/2`n" -ForegroundColor Cyan

# FINAL REPORT
Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                    FINAL TEST REPORT                       ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

$successRate = [math]::Round(($totalPassed / $totalTests) * 100, 2)

Write-Host "OVERALL RESULTS:" -ForegroundColor Cyan
Write-Host "  Total Tests: $totalTests" -ForegroundColor White
Write-Host "  Passed: $totalPassed" -ForegroundColor Green
Write-Host "  Failed: $($totalTests - $totalPassed)" -ForegroundColor Red
Write-Host "  Success Rate: $successRate%`n" -ForegroundColor $(if ($successRate -eq 100) { "Green" } else { "Yellow" })

Write-Host "SECTION BREAKDOWN:" -ForegroundColor Cyan
Write-Host "  Infrastructure: 3 tests" -ForegroundColor White
Write-Host "  Authentication: 4 tests" -ForegroundColor White
Write-Host "  Notifications: 6 tests" -ForegroundColor White
Write-Host "  Events: 2 tests" -ForegroundColor White
Write-Host "  Subscribers: 2 tests`n" -ForegroundColor White

Write-Host "SYSTEM STATUS:" -ForegroundColor Cyan
if ($successRate -eq 100) {
    Write-Host "  ✅ ALL SYSTEMS OPERATIONAL" -ForegroundColor Green
} elseif ($successRate -ge 80) {
    Write-Host "  ⚠️  MOSTLY OPERATIONAL - Minor Issues" -ForegroundColor Yellow
} else {
    Write-Host "  ❌ CRITICAL ISSUES DETECTED" -ForegroundColor Red
}

Write-Host "`nBackend URL: $backend" -ForegroundColor White
Write-Host "Test Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n" -ForegroundColor White
