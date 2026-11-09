package com.movy.app

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.location.LocationManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.text.NumberFormat
import java.util.Currency
import java.util.Locale

// --- CORES DO DESIGN SYSTEM MOVY ---
val MovyNavy = Color(0xFF0B2545)
val MovyNavyLight = Color(0xFF134074)
val MovyPink = Color(0xFFCD2379)
val MovyPinkLight = Color(0xFFFCE7F3)
val MovyBackground = Color(0xFFF8FAFC)
val MovyCardSurface = Color(0xFFFFFFFF)
val MovyTextPrimary = Color(0xFF0F172A)
val MovyTextSecondary = Color(0xFF64748B)
val MovyEmerald = Color(0xFF10B981)
val MovyAmber = Color(0xFFF59E0B)
val MovyRose = Color(0xFFEF4444)

private val moneyFormat = NumberFormat.getCurrencyInstance(Locale.forLanguageTag("pt-BR")).apply {
    try {
        currency = Currency.getInstance("BRL")
    } catch (_: Exception) {}
}
private fun formatMoney(cents: Int): String {
    return moneyFormat.format(cents / 100.0)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MovyApp() {
    val context = LocalContext.current
    val prefs = remember { context.getSharedPreferences("movy_unified", Context.MODE_PRIVATE) }
    
    // Estados principais
    var token by remember { mutableStateOf(prefs.getString("token", "").orEmpty()) }
    var isDriverMode by remember { mutableStateOf(prefs.getBoolean("is_driver_mode", false)) }
    var isPortuguese by remember { mutableStateOf(prefs.getBoolean("portuguese", true)) }
    var currentTab by remember { mutableStateOf(if (isDriverMode) "cockpit" else "request") }
    var errorMessage by remember { mutableStateOf("") }
    
    // Perfil e Dados
    var profile by remember { mutableStateOf(JSONObject()) }
    var activeTrip by remember { mutableStateOf<JSONObject?>(null) }
    var chatMessages by remember { mutableStateOf(listOf("Olá! Estou aguardando na calçada.", "Perfeito, já estou virando a esquina!")) }
    var isDriverOnline by remember { mutableStateOf(false) }
    var pendingOffer by remember { mutableStateOf<JSONObject?>(null) }
    
    val scope = rememberCoroutineScope()
    val api = remember(token) { MovyApi(BuildConfig.API_BASE, token) }
    
    val t = { key: String ->
        if (isPortuguese) ptMessages[key] ?: key else enMessages[key] ?: key
    }

    fun launchTask(block: () -> Unit) {
        scope.launch {
            try {
                errorMessage = ""
                withContext(Dispatchers.IO) { block() }
            } catch (e: Exception) {
                errorMessage = e.message ?: "Ocorreu uma falha na requisição."
            }
        }
    }

    // Carregar perfil inicial
    LaunchedEffect(token, isDriverMode) {
        if (token.isNotEmpty()) {
            launchTask {
                try {
                    val path = if (isDriverMode) "/api/driver/me" else "/api/rider/me"
                    val res = api.get(path)
                    val key = if (isDriverMode) "driver" else "rider"
                    if (res.has(key)) profile = res.getJSONObject(key)
                } catch (_: Exception) {}
            }
        }
    }

    MaterialTheme(
        colorScheme = lightColorScheme(
            primary = MovyPink,
            secondary = MovyNavy,
            background = MovyBackground,
            surface = MovyCardSurface,
            onPrimary = Color.White,
            onSecondary = Color.White
        )
    ) {
        if (token.isEmpty()) {
            // TELA DE AUTENTICAÇÃO E CADASTRO UNIFICADA
            AuthScreen(
                isDriver = isDriverMode,
                isPortuguese = isPortuguese,
                onLanguageToggle = {
                    isPortuguese = !isPortuguese
                    prefs.edit().putBoolean("portuguese", isPortuguese).apply()
                },
                onRoleToggle = {
                    isDriverMode = !isDriverMode
                    prefs.edit().putBoolean("is_driver_mode", isDriverMode).apply()
                },
                errorMessage = errorMessage,
                t = t,
                onLogin = { email, pass ->
                    launchTask {
                        val path = if (isDriverMode) "/api/driver/login" else "/api/rider/login"
                        val body = JSONObject().put("email", email).put("password", pass)
                        val res = api.post(path, body)
                        token = res.optString("token", "dummy_token_dev")
                        prefs.edit().putString("token", token).apply()
                        val key = if (isDriverMode) "driver" else "rider"
                        if (res.has(key)) profile = res.getJSONObject(key)
                    }
                },
                onRegister = { body ->
                    launchTask {
                        val path = if (isDriverMode) "/api/driver/register" else "/api/rider/register"
                        val res = api.post(path, body)
                        token = res.optString("token", "dummy_token_dev")
                        prefs.edit().putString("token", token).apply()
                        val key = if (isDriverMode) "driver" else "rider"
                        if (res.has(key)) profile = res.getJSONObject(key)
                    }
                }
            )
            return@MaterialTheme
        }

        // TELA PRINCIPAL UNIFICADA (PASSAGEIRO OU MOTORISTA)
        Scaffold(
            topBar = {
                TopAppBar(
                    title = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(Brush.linearGradient(listOf(MovyPink, MovyNavy))),
                                contentAlignment = Alignment.Center
                            ) {
                                Text("M", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 20.sp)
                            }
                            Spacer(Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = "MOVY",
                                    fontWeight = FontWeight.Black,
                                    fontSize = 18.sp,
                                    color = MovyNavy
                                )
                                Text(
                                    text = if (isDriverMode) t("mode_driver") else t("mode_passenger"),
                                    fontSize = 11.sp,
                                    color = MovyPink,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    },
                    actions = {
                        // Switch de Modo Passageiro / Motorista
                        FilterChip(
                            selected = isDriverMode,
                            onClick = {
                                isDriverMode = !isDriverMode
                                currentTab = if (isDriverMode) "cockpit" else "request"
                                prefs.edit().putBoolean("is_driver_mode", isDriverMode).apply()
                            },
                            label = { Text(if (isDriverMode) "Sou Motorista" else "Sou Passageiro", fontSize = 11.sp) },
                            leadingIcon = {
                                Icon(
                                    if (isDriverMode) Icons.Default.DirectionsCar else Icons.Default.Person,
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp)
                                )
                            },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = MovyNavyLight,
                                selectedLabelColor = Color.White,
                                selectedLeadingIconColor = Color.White
                            )
                        )
                        Spacer(Modifier.width(6.dp))
                        // Botão de idioma
                        IconButton(onClick = {
                            isPortuguese = !isPortuguese
                            prefs.edit().putBoolean("portuguese", isPortuguese).apply()
                        }) {
                            Text(if (isPortuguese) "🇧🇷" else "🇺🇸", fontSize = 18.sp)
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
                )
            },
            bottomBar = {
                NavigationBar(containerColor = Color.White, tonalElevation = 8.dp) {
                    val tabs = if (isDriverMode) {
                        listOf(
                            Triple("cockpit", t("tab_cockpit"), Icons.Default.Speed),
                            Triple("earnings", t("tab_earnings"), Icons.Default.AttachMoney),
                            Triple("documents", t("tab_docs"), Icons.Default.Description),
                            Triple("profile", t("tab_profile"), Icons.Default.AccountCircle)
                        )
                    } else {
                        listOf(
                            Triple("request", t("tab_ride"), Icons.Default.LocalTaxi),
                            Triple("trips", t("tab_trips"), Icons.Default.History),
                            Triple("wallet", t("tab_wallet"), Icons.Default.AccountBalanceWallet),
                            Triple("profile", t("tab_profile"), Icons.Default.AccountCircle)
                        )
                    }
                    tabs.forEach { (key, label, icon) ->
                        NavigationBarItem(
                            selected = currentTab == key,
                            onClick = { currentTab = key },
                            label = { Text(label, fontSize = 10.sp, fontWeight = if (currentTab == key) FontWeight.Bold else FontWeight.Normal) },
                            icon = { Icon(icon, contentDescription = label) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = MovyPink,
                                selectedTextColor = MovyPink,
                                indicatorColor = MovyPinkLight
                            )
                        )
                    }
                }
            }
        ) { paddingValues ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .background(MovyBackground)
            ) {
                if (isDriverMode) {
                    // MÓDULO MOTORISTA
                    when (currentTab) {
                        "cockpit" -> DriverCockpitScreen(
                            profile = profile,
                            isOnline = isDriverOnline,
                            onToggleOnline = { isDriverOnline = !isDriverOnline },
                            activeTrip = activeTrip,
                            pendingOffer = pendingOffer,
                            onAcceptOffer = {
                                activeTrip = pendingOffer
                                pendingOffer = null
                            },
                            onDeclineOffer = { pendingOffer = null },
                            onTriggerMockOffer = {
                                pendingOffer = JSONObject()
                                    .put("id", "TRIP-882")
                                    .put("passenger", "Beatriz Lima")
                                    .put("origin", "Av. Monsenhor Ângelo Sampaio, 100")
                                    .put("destination", "COHAB Massangano, Petrolina")
                                    .put("fare", 2850)
                                    .put("distance", "4.8 km")
                            },
                            onUpdateTripStatus = { nextStatus ->
                                activeTrip?.put("status", nextStatus)
                                if (nextStatus == "completed") {
                                    activeTrip = null
                                }
                            },
                            t = t
                        )
                        "earnings" -> DriverEarningsScreen(profile = profile, t = t)
                        "documents" -> DriverDocumentsScreen(profile = profile, t = t)
                        "profile" -> ProfileScreen(profile = profile, isDriver = true, onSignOut = {
                            token = ""
                            prefs.edit().remove("token").apply()
                        }, t = t)
                    }
                } else {
                    // MÓDULO PASSAGEIRO
                    when (currentTab) {
                        "request" -> RiderRequestScreen(
                            activeTrip = activeTrip,
                            onRequestTrip = { origin, dest, category, payment ->
                                activeTrip = JSONObject()
                                    .put("id", "TRIP-1029")
                                    .put("driverName", "Alexandre Moura")
                                    .put("car", "Hyundai HB20 Comfort")
                                    .put("plate", "JKS-8Y95")
                                    .put("rating", "4.9★")
                                    .put("origin", origin)
                                    .put("destination", dest)
                                    .put("category", category)
                                    .put("payment", payment)
                                    .put("fare", 2250)
                                    .put("status", "accepted")
                            },
                            onCancelTrip = { activeTrip = null },
                            chatMessages = chatMessages,
                            onSendMessage = { chatMessages = chatMessages + it },
                            t = t
                        )
                        "trips" -> RiderTripsScreen(t = t)
                        "wallet" -> RiderWalletScreen(t = t)
                        "profile" -> ProfileScreen(profile = profile, isDriver = false, onSignOut = {
                            token = ""
                            prefs.edit().remove("token").apply()
                        }, t = t)
                    }
                }
            }
        }
    }
}

// -------------------------------------------------------------
// TELA DE AUTENTICAÇÃO (LOGIN / REGISTRO) COM DESIGN MODERNO
// -------------------------------------------------------------
@Composable
fun AuthScreen(
    isDriver: Boolean,
    isPortuguese: Boolean,
    onLanguageToggle: () -> Unit,
    onRoleToggle: () -> Unit,
    errorMessage: String,
    t: (String) -> String,
    onLogin: (String, String) -> Unit,
    onRegister: (JSONObject) -> Unit
) {
    var isRegisterMode by remember { mutableStateOf(false) }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var name by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var city by remember { mutableStateOf("Petrolina - PE") }
    var vehicleModel by remember { mutableStateOf("") }
    var vehiclePlate by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(MovyNavy, Color(0xFF07192F))))
            .verticalScroll(rememberScrollState())
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(Modifier.height(30.dp))
        
        // Seletor de Idioma e Modo no topo
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            FilterChip(
                selected = isDriver,
                onClick = onRoleToggle,
                label = { Text(if (isDriver) "Motorista" else "Passageiro", color = Color.White) },
                colors = FilterChipDefaults.filterChipColors(selectedContainerColor = MovyPink)
            )
            IconButton(onClick = onLanguageToggle) {
                Text(if (isPortuguese) "🇧🇷 PT" else "🇺🇸 EN", color = Color.White, fontWeight = FontWeight.Bold)
            }
        }

        Spacer(Modifier.height(20.dp))

        // Logotipo Estilizado
        Box(
            modifier = Modifier
                .size(72.dp)
                .clip(CircleShape)
                .background(Brush.linearGradient(listOf(MovyPink, Color(0xFFE11D48))))
                .shadow(12.dp, CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(Icons.Default.DirectionsCar, contentDescription = null, tint = Color.White, modifier = Modifier.size(40.dp))
        }

        Spacer(Modifier.height(14.dp))
        Text("MOVY", fontSize = 32.sp, fontWeight = FontWeight.Black, color = Color.White, letterSpacing = 2.sp)
        Text(
            text = if (isDriver) "Mobilidade & Ganhos para Motoristas" else "Sua viagem rápida, segura e econômica",
            fontSize = 13.sp,
            color = Color.White.copy(alpha = 0.8f)
        )

        Spacer(Modifier.height(28.dp))

        // Card Formulário
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
        ) {
            Column(modifier = Modifier.padding(24.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                Text(
                    text = if (isRegisterMode) t("create_account") else t("welcome_back"),
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = MovyNavy
                )

                if (isRegisterMode) {
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text(t("full_name")) },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        leadingIcon = { Icon(Icons.Default.Person, null) }
                    )
                    OutlinedTextField(
                        value = phone,
                        onValueChange = { phone = it },
                        label = { Text(t("phone")) },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        leadingIcon = { Icon(Icons.Default.Phone, null) }
                    )
                    OutlinedTextField(
                        value = city,
                        onValueChange = { city = it },
                        label = { Text(t("city")) },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        leadingIcon = { Icon(Icons.Default.LocationCity, null) }
                    )
                    if (isDriver) {
                        OutlinedTextField(
                            value = vehicleModel,
                            onValueChange = { vehicleModel = it },
                            label = { Text("Modelo do Veículo (ex: Onix 1.0)") },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                            leadingIcon = { Icon(Icons.Default.DirectionsCar, null) }
                        )
                        OutlinedTextField(
                            value = vehiclePlate,
                            onValueChange = { vehiclePlate = it },
                            label = { Text("Placa do Veículo (ex: BRA-2E19)") },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                            leadingIcon = { Icon(Icons.Default.ConfirmationNumber, null) }
                        )
                    }
                }

                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text(t("email")) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    leadingIcon = { Icon(Icons.Default.Email, null) }
                )

                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text(t("password")) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    leadingIcon = { Icon(Icons.Default.Lock, null) }
                )

                if (errorMessage.isNotEmpty()) {
                    Text(errorMessage, color = MovyRose, fontSize = 12.sp)
                }

                Button(
                    onClick = {
                        if (isRegisterMode) {
                            val body = JSONObject()
                                .put("name", name)
                                .put("email", email)
                                .put("phone", phone)
                                .put("password", password)
                                .put("city", city)
                            if (isDriver) {
                                body.put("vehicle", vehicleModel).put("plate", vehiclePlate)
                            }
                            onRegister(body)
                        } else {
                            onLogin(email.trim(), password)
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = MovyPink)
                ) {
                    Text(
                        if (isRegisterMode) t("btn_register") else t("btn_login"),
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                }

                TextButton(
                    onClick = { isRegisterMode = !isRegisterMode },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        if (isRegisterMode) t("already_have_account") else t("need_account"),
                        color = MovyNavy,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }
        Spacer(Modifier.height(30.dp))
    }
}

// -------------------------------------------------------------
// MÓDULO PASSAGEIRO: SOLICITAÇÃO, MAPA E ACOMPANHAMENTO DA CORRIDA
// -------------------------------------------------------------
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RiderRequestScreen(
    activeTrip: JSONObject?,
    onRequestTrip: (String, String, String, String) -> Unit,
    onCancelTrip: () -> Unit,
    chatMessages: List<String>,
    onSendMessage: (String) -> Unit,
    t: (String) -> String
) {
    var originAddress by remember { mutableStateOf("Meu local atual (GPS)") }
    var destinationAddress by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("Movy Pop") }
    var selectedPayment by remember { mutableStateOf("PIX") }
    var couponCode by remember { mutableStateOf("") }
    var isCouponApplied by remember { mutableStateOf(false) }
    var isChatOpen by remember { mutableStateOf(false) }
    var messageInput by remember { mutableStateOf("") }

    if (activeTrip != null) {
        // TELA DE CORRIDA ATIVA / EM ANDAMENTO (PASSAGEIRO)
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Card de Status do Motorista
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(6.dp)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Badge(containerColor = MovyEmerald) {
                            Text("MOTORISTA A CAMINHO", color = Color.White, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                        }
                        Text("Chega em 3 min", fontWeight = FontWeight.Bold, color = MovyPink)
                    }

                    Spacer(Modifier.height(14.dp))

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(56.dp)
                                .clip(CircleShape)
                                .background(MovyNavyLight),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.Person, contentDescription = null, tint = Color.White, modifier = Modifier.size(32.dp))
                        }
                        Spacer(Modifier.width(14.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(activeTrip.optString("driverName", "Alexandre"), fontWeight = FontWeight.Bold, fontSize = 18.sp, color = MovyNavy)
                            Text(activeTrip.optString("car", "Hyundai HB20") + " · " + activeTrip.optString("plate", "JKS-8Y95"), color = MovyTextSecondary, fontSize = 13.sp)
                        }
                        Card(colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF3C7)), shape = RoundedCornerShape(8.dp)) {
                            Row(modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Star, null, tint = MovyAmber, modifier = Modifier.size(16.dp))
                                Spacer(Modifier.width(4.dp))
                                Text(activeTrip.optString("rating", "4.9"), fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Color(0xFF78350F))
                            }
                        }
                    }

                    Divider(Modifier.padding(vertical = 14.dp), color = Color(0xFFE2E8F0))

                    // Trajeto
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.RadioButtonChecked, null, tint = MovyEmerald, modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(10.dp))
                        Text(activeTrip.optString("origin", "Embarque"), fontSize = 13.sp, color = MovyTextPrimary, maxLines = 1, overflow = TextOverflow.Ellipsis)
                    }
                    Spacer(Modifier.height(8.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.LocationOn, null, tint = MovyRose, modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(10.dp))
                        Text(activeTrip.optString("destination", "Destino"), fontSize = 13.sp, color = MovyTextPrimary, fontWeight = FontWeight.SemiBold, maxLines = 1, overflow = TextOverflow.Ellipsis)
                    }

                    Spacer(Modifier.height(16.dp))

                    // Ações: Chat, Compartilhar, Cancelar
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Button(
                            onClick = { isChatOpen = !isChatOpen },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = MovyNavyLight)
                        ) {
                            Icon(Icons.Default.Chat, null, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.width(6.dp))
                            Text("Chat")
                        }
                        OutlinedButton(
                            onClick = onCancelTrip,
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = MovyRose)
                        ) {
                            Icon(Icons.Default.Close, null, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.width(6.dp))
                            Text("Cancelar")
                        }
                    }
                }
            }

            // Chat Expandido
            if (isChatOpen) {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(4.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Mensagens com o Motorista", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = MovyNavy)
                        Spacer(Modifier.height(10.dp))
                        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                            chatMessages.forEach { msg ->
                                Surface(
                                    color = Color(0xFFF1F5F9),
                                    shape = RoundedCornerShape(12.dp),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Text(msg, modifier = Modifier.padding(10.dp), fontSize = 13.sp)
                                }
                            }
                        }
                        Spacer(Modifier.height(10.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            OutlinedTextField(
                                value = messageInput,
                                onValueChange = { messageInput = it },
                                placeholder = { Text("Escreva uma mensagem...") },
                                modifier = Modifier.weight(1f),
                                shape = RoundedCornerShape(12.dp)
                            )
                            Spacer(Modifier.width(8.dp))
                            IconButton(onClick = {
                                if (messageInput.isNotEmpty()) {
                                    onSendMessage(messageInput)
                                    messageInput = ""
                                }
                            }) {
                                Icon(Icons.Default.Send, null, tint = MovyPink)
                            }
                        }
                    }
                }
            }
        }
        return
    }

    // FORMULÁRIO DE PEDIDO DE VIAGEM COM MAPA MOCK
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // MAPA VISUAL INTEGRADO
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .height(180.dp),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFE2E8F0)),
            elevation = CardDefaults.cardElevation(4.dp)
        ) {
            Box(modifier = Modifier.fillMaxSize()) {
                // Fundo estilizado como mapa
                Canvas(modifier = Modifier.fillMaxSize()) {
                    drawRect(color = Color(0xFFE8EEF5))
                }
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp),
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Surface(shape = CircleShape, color = Color.White.copy(alpha = 0.9f), shadowElevation = 4.dp) {
                            Row(modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
                                Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(MovyEmerald))
                                Spacer(Modifier.width(6.dp))
                                Text("GPS Ativo", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MovyNavy)
                            }
                        }
                        Surface(shape = CircleShape, color = Color.White.copy(alpha = 0.9f), shadowElevation = 4.dp) {
                            Text("Petrolina - PE", modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Default.Navigation, null, tint = MovyPink, modifier = Modifier.size(32.dp))
                    }
                    Text(
                        "Selecione o destino para calcular a rota",
                        fontSize = 12.sp,
                        color = MovyNavy,
                        fontWeight = FontWeight.SemiBold,
                        modifier = Modifier.fillMaxWidth(),
                        textAlign = TextAlign.Center
                    )
                }
            }
        }

        // CAMPOS DE ENDEREÇO
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(4.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedTextField(
                    value = originAddress,
                    onValueChange = { originAddress = it },
                    label = { Text("Local de Embarque") },
                    leadingIcon = { Icon(Icons.Default.MyLocation, null, tint = MovyEmerald) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )

                OutlinedTextField(
                    value = destinationAddress,
                    onValueChange = { destinationAddress = it },
                    label = { Text("Para onde vamos?") },
                    leadingIcon = { Icon(Icons.Default.Place, null, tint = MovyPink) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )

                // Sugestões Rápidas de Destino
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    listOf("Trabalho", "Casa", "Shopping", "Aeroporto").forEach { sug ->
                        SuggestionChip(
                            onClick = { destinationAddress = "$sug, Centro" },
                            label = { Text(sug, fontSize = 11.sp) }
                        )
                    }
                }
            }
        }

        // CARROSSEL DE CATEGORIAS MOVY
        Text("Escolha a categoria", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = MovyNavy)

        val categories = listOf(
            Triple("Movy Pop", "Econômico · 3 min", 1650),
            Triple("Movy Comfort", "Carro novo & espaçoso · 5 min", 2390),
            Triple("Movy Moto", "Rápido & Ágil · 2 min", 1090),
            Triple("Movy Entrega", "Pacotes e documentos", 1300)
        )

        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            categories.forEach { (cat, desc, cents) ->
                val isSelected = selectedCategory == cat
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { selectedCategory = cat },
                    shape = RoundedCornerShape(16.dp),
                    border = if (isSelected) BorderStroke(2.dp, MovyPink) else null,
                    colors = CardDefaults.cardColors(containerColor = if (isSelected) MovyPinkLight.copy(alpha = 0.5f) else Color.White),
                    elevation = CardDefaults.cardElevation(if (isSelected) 4.dp else 1.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(44.dp)
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(if (isSelected) MovyPink else MovyNavyLight),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    if (cat.contains("Moto")) Icons.Default.TwoWheeler else Icons.Default.DirectionsCar,
                                    contentDescription = null,
                                    tint = Color.White
                                )
                            }
                            Spacer(Modifier.width(12.dp))
                            Column {
                                Text(cat, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = MovyNavy)
                                Text(desc, fontSize = 12.sp, color = MovyTextSecondary)
                            }
                        }
                        Text(formatMoney(cents), fontWeight = FontWeight.Black, fontSize = 16.sp, color = MovyNavy)
                    }
                }
            }
        }

        // FORMA DE PAGAMENTO E CUPOM
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White)
        ) {
            Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Payment, null, tint = MovyPink)
                        Spacer(Modifier.width(8.dp))
                        Text("Forma de Pagamento:", fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                    }
                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        listOf("PIX", "Dinheiro", "Cartão").forEach { method ->
                            FilterChip(
                                selected = selectedPayment == method,
                                onClick = { selectedPayment = method },
                                label = { Text(method, fontSize = 11.sp) }
                            )
                        }
                    }
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    OutlinedTextField(
                        value = couponCode,
                        onValueChange = { couponCode = it },
                        placeholder = { Text("Cupom de desconto") },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(10.dp)
                    )
                    Spacer(Modifier.width(8.dp))
                    Button(
                        onClick = { isCouponApplied = couponCode.isNotEmpty() },
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = MovyNavyLight)
                    ) {
                        Text(if (isCouponApplied) "Aplicado!" else "Aplicar")
                    }
                }
            }
        }

        // BOTÃO PRINCIPAL PEDIR CORRIDA
        Button(
            onClick = {
                val dest = if (destinationAddress.isEmpty()) "Centro de Petrolina" else destinationAddress
                onRequestTrip(originAddress, dest, selectedCategory, selectedPayment)
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = MovyPink)
        ) {
            Text("Confirmar e Pedir $selectedCategory", fontSize = 16.sp, fontWeight = FontWeight.Bold)
        }
        
        Spacer(Modifier.height(10.dp))
    }
}

// -------------------------------------------------------------
// MÓDULO MOTORISTA: COCKPIT, RADAR, OFERTAS E CONTROLE DE CORRIDA
// -------------------------------------------------------------
@Composable
fun DriverCockpitScreen(
    profile: JSONObject,
    isOnline: Boolean,
    onToggleOnline: () -> Unit,
    activeTrip: JSONObject?,
    pendingOffer: JSONObject?,
    onAcceptOffer: () -> Unit,
    onDeclineOffer: () -> Unit,
    onTriggerMockOffer: () -> Unit,
    onUpdateTripStatus: (String) -> Unit,
    t: (String) -> String
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // CARD STATUS ON/OFFLINE
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = if (isOnline) Color(0xFFF0FDF4) else Color.White),
            border = if (isOnline) BorderStroke(2.dp, MovyEmerald) else null,
            elevation = CardDefaults.cardElevation(4.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = if (isOnline) "VOCÊ ESTÁ ONLINE" else "VOCÊ ESTÁ DESCONECTADO",
                    fontWeight = FontWeight.Black,
                    fontSize = 16.sp,
                    color = if (isOnline) MovyEmerald else MovyTextSecondary
                )
                Text(
                    text = if (isOnline) "Pronto para receber novas corridas próximas" else "Fique online para receber ofertas e faturar",
                    fontSize = 12.sp,
                    color = MovyTextSecondary,
                    textAlign = TextAlign.Center
                )

                Spacer(Modifier.height(18.dp))

                Button(
                    onClick = onToggleOnline,
                    modifier = Modifier
                        .fillMaxWidth(0.75f)
                        .height(52.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isOnline) MovyRose else MovyEmerald
                    )
                ) {
                    Icon(if (isOnline) Icons.Default.PowerSettingsNew else Icons.Default.PlayArrow, null)
                    Spacer(Modifier.width(8.dp))
                    Text(
                        if (isOnline) "Ficar Offline" else "Ficar Online Agora",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        // GANHOS RÁPIDOS DE HOJE
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Card(
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text("Ganhos de Hoje", fontSize = 12.sp, color = MovyTextSecondary)
                    Text("R$ 148,50", fontSize = 20.sp, fontWeight = FontWeight.Black, color = MovyNavy)
                }
            }
            Card(
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text("Corridas Hoje", fontSize = 12.sp, color = MovyTextSecondary)
                    Text("6 viagens", fontSize = 20.sp, fontWeight = FontWeight.Black, color = MovyPink)
                }
            }
        }

        // OFERTA DE CORRIDA PENDENTE (POPUP COM RADAR)
        if (pendingOffer != null) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = BorderStroke(2.dp, MovyPink),
                elevation = CardDefaults.cardElevation(8.dp)
            ) {
                Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Badge(containerColor = MovyPink) {
                            Text("NOVA CORRIDA DISPONÍVEL", color = Color.White, fontWeight = FontWeight.Bold, modifier = Modifier.padding(4.dp))
                        }
                        Text("15s", color = MovyRose, fontWeight = FontWeight.Black, fontSize = 16.sp)
                    }

                    Text(
                        text = formatMoney(pendingOffer.optInt("fare", 2850)),
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Black,
                        color = MovyNavy
                    )

                    Divider(color = Color(0xFFE2E8F0))

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Person, null, tint = MovyNavy, modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(8.dp))
                        Text(pendingOffer.optString("passenger", "Passageiro"), fontWeight = FontWeight.SemiBold)
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.RadioButtonChecked, null, tint = MovyEmerald, modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(8.dp))
                        Text(pendingOffer.optString("origin", "Embarque"), fontSize = 13.sp)
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.LocationOn, null, tint = MovyRose, modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(8.dp))
                        Text(pendingOffer.optString("destination", "Destino"), fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                    }

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Button(
                            onClick = onAcceptOffer,
                            modifier = Modifier.weight(1f).height(50.dp),
                            shape = RoundedCornerShape(14.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = MovyEmerald)
                        ) {
                            Text("ACEITAR", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        }
                        OutlinedButton(
                            onClick = onDeclineOffer,
                            modifier = Modifier.weight(1f).height(50.dp),
                            shape = RoundedCornerShape(14.dp)
                        ) {
                            Text("Recusar", color = MovyTextSecondary)
                        }
                    }
                }
            }
        } else if (isOnline && activeTrip == null) {
            // Botão simulador de teste para receber corrida
            OutlinedButton(
                onClick = onTriggerMockOffer,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp)
            ) {
                Icon(Icons.Default.Radar, null)
                Spacer(Modifier.width(8.dp))
                Text("Simular Chamada de Corrida Próxima")
            }
        }

        // CORRIDA EM EXECUÇÃO DO MOTORISTA
        if (activeTrip != null) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(6.dp)
            ) {
                Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text("Corrida em Andamento", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = MovyNavy)
                    
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text("Passageiro", fontSize = 12.sp, color = MovyTextSecondary)
                            Text(activeTrip.optString("passenger", "Beatriz Lima"), fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        }
                        Column(horizontalAlignment = Alignment.End) {
                            Text("Valor a Receber", fontSize = 12.sp, color = MovyTextSecondary)
                            Text(formatMoney(activeTrip.optInt("fare", 2850)), fontWeight = FontWeight.Black, fontSize = 16.sp, color = MovyEmerald)
                        }
                    }

                    Divider(color = Color(0xFFE2E8F0))

                    // Botões de Status da Corrida
                    Button(
                        onClick = { onUpdateTripStatus("arrived") },
                        modifier = Modifier.fillMaxWidth().height(48.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = MovyNavyLight)
                    ) {
                        Text("Sinalizar: CHEGUEI NO LOCAL", fontWeight = FontWeight.Bold)
                    }

                    Button(
                        onClick = { onUpdateTripStatus("in_progress") },
                        modifier = Modifier.fillMaxWidth().height(48.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB))
                    ) {
                        Text("INICIAR CORRIDA", fontWeight = FontWeight.Bold)
                    }

                    Button(
                        onClick = { onUpdateTripStatus("completed") },
                        modifier = Modifier.fillMaxWidth().height(48.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = MovyEmerald)
                    ) {
                        Text("FINALIZAR E RECEBER", fontWeight = FontWeight.Bold)
                    }

                    // Botão de Pânico
                    OutlinedButton(
                        onClick = { /* SOS */ },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = MovyRose)
                    ) {
                        Icon(Icons.Default.Security, null)
                        Spacer(Modifier.width(6.dp))
                        Text("Botão de Pânico / SOS")
                    }
                }
            }
        }
    }
}

// -------------------------------------------------------------
// EXTRATO E FINANCEIRO DO MOTORISTA
// -------------------------------------------------------------
@Composable
fun DriverEarningsScreen(profile: JSONObject, t: (String) -> String) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = MovyNavy),
            elevation = CardDefaults.cardElevation(4.dp)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text("Saldo Disponível para Saque", color = Color.White.copy(alpha = 0.8f), fontSize = 13.sp)
                Text("R$ 412,80", color = Color.White, fontSize = 32.sp, fontWeight = FontWeight.Black)
                Spacer(Modifier.height(14.dp))
                Button(
                    onClick = { /* Saque via PIX */ },
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = MovyPink)
                ) {
                    Text("Solicitar Transferência PIX", fontWeight = FontWeight.Bold)
                }
            }
        }

        Text("Histórico Recente", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = MovyNavy)

        listOf(
            Triple("Corrida #1028", "Centro → Areia Branca", 2450),
            Triple("Corrida #1027", "Aeroporto → Orla", 3800),
            Triple("Corrida #1026", "Atrás da Banca → Gercino", 1600),
            Triple("Corrida #1025", "COHAB Massangano → Centro", 2100)
        ).forEach { (num, route, cents) ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(num, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = MovyNavy)
                        Text(route, fontSize = 12.sp, color = MovyTextSecondary)
                    }
                    Text(formatMoney(cents), fontWeight = FontWeight.Black, fontSize = 15.sp, color = MovyEmerald)
                }
            }
        }
    }
}

// -------------------------------------------------------------
// DOCUMENTOS DO MOTORISTA
// -------------------------------------------------------------
@Composable
fun DriverDocumentsScreen(profile: JSONObject, t: (String) -> String) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Text("Meus Documentos", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = MovyNavy)

        val docs = listOf(
            Triple("CNH com EAR", "Aprovado", MovyEmerald),
            Triple("CRLV do Veículo", "Aprovado", MovyEmerald),
            Triple("Foto de Perfil", "Aprovado", MovyEmerald),
            Triple("Antecedentes Criminais", "Em Análise", MovyAmber)
        )

        docs.forEach { (name, status, color) ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Description, null, tint = MovyNavyLight)
                        Spacer(Modifier.width(12.dp))
                        Text(name, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                    }
                    Badge(containerColor = color) {
                        Text(status, color = Color.White, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp), fontSize = 11.sp)
                    }
                }
            }
        }
    }
}

// -------------------------------------------------------------
// HISTÓRICO DE CORRIDAS (PASSAGEIRO)
// -------------------------------------------------------------
@Composable
fun RiderTripsScreen(t: (String) -> String) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Minhas Viagens", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = MovyNavy)

        listOf(
            Triple("Ontem às 19:40", "Centro → Orla de Petrolina", 1850),
            Triple("06 Nov às 08:15", "Residencial → Shopping", 2400),
            Triple("04 Nov às 14:30", "Aeroporto → Hotel", 3500)
        ).forEach { (date, route, cents) ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(date, fontSize = 12.sp, color = MovyTextSecondary)
                        Text(formatMoney(cents), fontWeight = FontWeight.Bold, color = MovyNavy)
                    }
                    Text(route, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                }
            }
        }
    }
}

// -------------------------------------------------------------
// CARTEIRA DO PASSAGEIRO
// -------------------------------------------------------------
@Composable
fun RiderWalletScreen(t: (String) -> String) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = MovyNavy)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text("Saldo na Carteira Movy", color = Color.White.copy(alpha = 0.8f), fontSize = 13.sp)
                Text("R$ 54,00", color = Color.White, fontSize = 32.sp, fontWeight = FontWeight.Black)
                Spacer(Modifier.height(14.dp))
                Button(
                    onClick = { /* Recarga */ },
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = MovyPink)
                ) {
                    Text("+ Adicionar Saldo via PIX", fontWeight = FontWeight.Bold)
                }
            }
        }

        Text("Formas de Pagamento Salvas", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = MovyNavy)

        Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(14.dp), colors = CardDefaults.cardColors(containerColor = Color.White)) {
            Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.CreditCard, null, tint = MovyPink)
                Spacer(Modifier.width(12.dp))
                Column {
                    Text("Mastercard final 4092", fontWeight = FontWeight.SemiBold)
                    Text("Cartão de Crédito principal", fontSize = 12.sp, color = MovyTextSecondary)
                }
            }
        }
    }
}

// -------------------------------------------------------------
// PERFIL E CONFIGURAÇÕES
// -------------------------------------------------------------
@Composable
fun ProfileScreen(profile: JSONObject, isDriver: Boolean, onSignOut: () -> Unit, t: (String) -> String) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White)
        ) {
            Row(modifier = Modifier.padding(18.dp), verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier.size(60.dp).clip(CircleShape).background(MovyNavy),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Default.Person, null, tint = Color.White, modifier = Modifier.size(36.dp))
                }
                Spacer(Modifier.width(14.dp))
                Column {
                    Text(profile.optString("name", "Usuário Movy"), fontWeight = FontWeight.Bold, fontSize = 18.sp, color = MovyNavy)
                    Text(profile.optString("email", "usuario@movy.com"), fontSize = 13.sp, color = MovyTextSecondary)
                }
            }
        }

        Button(
            onClick = onSignOut,
            modifier = Modifier.fillMaxWidth().height(50.dp),
            shape = RoundedCornerShape(14.dp),
            colors = ButtonDefaults.buttonColors(containerColor = MovyRose)
        ) {
            Icon(Icons.Default.ExitToApp, null)
            Spacer(Modifier.width(8.dp))
            Text("Sair da Conta")
        }
    }
}

// Dicionário i18n
private val ptMessages = mapOf(
    "welcome_back" to "Bem-vindo de volta",
    "create_account" to "Criar Conta Movy",
    "full_name" to "Nome Completo",
    "phone" to "Telefone com DDD",
    "city" to "Cidade de Atuação",
    "email" to "E-mail",
    "password" to "Senha",
    "btn_login" to "Entrar no Aplicativo",
    "btn_register" to "Concluir Cadastro",
    "already_have_account" to "Já possui uma conta? Entre aqui",
    "need_account" to "Não tem conta? Cadastre-se agora",
    "mode_driver" to "Modo Motorista",
    "mode_passenger" to "Modo Passageiro",
    "tab_cockpit" to "Cockpit",
    "tab_earnings" to "Ganhos",
    "tab_docs" to "Documentos",
    "tab_ride" to "Viagem",
    "tab_trips" to "Histórico",
    "tab_wallet" to "Carteira",
    "tab_profile" to "Perfil"
)

private val enMessages = mapOf(
    "welcome_back" to "Welcome Back",
    "create_account" to "Create Movy Account",
    "full_name" to "Full Name",
    "phone" to "Phone Number",
    "city" to "Operating City",
    "email" to "Email Address",
    "password" to "Password",
    "btn_login" to "Log In",
    "btn_register" to "Complete Registration",
    "already_have_account" to "Already have an account? Sign In",
    "need_account" to "Need an account? Register now",
    "mode_driver" to "Driver Mode",
    "mode_passenger" to "Passenger Mode",
    "tab_cockpit" to "Cockpit",
    "tab_earnings" to "Earnings",
    "tab_docs" to "Documents",
    "tab_ride" to "Ride",
    "tab_trips" to "Trips",
    "tab_wallet" to "Wallet",
    "tab_profile" to "Profile"
)
