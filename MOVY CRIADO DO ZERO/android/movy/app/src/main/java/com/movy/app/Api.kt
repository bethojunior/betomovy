package com.movy.app

import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

class MovyApi(base: String, var token: String = "") {
    private val root = base.trimEnd('/')
    private val http = OkHttpClient.Builder().callTimeout(30, TimeUnit.SECONDS).build()
    private val json = "application/json".toMediaType()

    fun get(path: String) = call("GET", path, null)
    fun post(path: String, body: JSONObject) = call("POST", path, body)

    private fun call(method: String, path: String, body: JSONObject?): JSONObject {
        val builder = Request.Builder().url(root + path)
        if (token.isNotEmpty()) builder.header("Authorization", "Bearer $token")
        if (body == null) builder.method(method, if (method == "GET") null else "{}".toRequestBody(json))
        else builder.method(method, body.toString().toRequestBody(json))
        http.newCall(builder.build()).execute().use { response ->
            val text = response.body?.string().orEmpty()
            val payload = if (text.startsWith("{")) JSONObject(text) else JSONObject()
            if (!response.isSuccessful) throw IllegalStateException(payload.optString("error", "Request failed."))
            return payload
        }
    }
}

fun JSONObject.array(name: String): List<JSONObject> {
    val list = optJSONArray(name) ?: JSONArray()
    return List(list.length()) { list.getJSONObject(it) }
}

fun JSONObject.text(name: String) = optString(name)
fun JSONObject.cents(name: String) = optInt(name)
