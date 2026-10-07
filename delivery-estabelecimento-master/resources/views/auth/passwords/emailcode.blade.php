@component('mail::message', ['logoUrl' => $logoUrl])
    # Código de verificação: {{ $verificationCode }}


    Atenciosamente, {{ $appName }}
@endcomponent
