#!/usr/bin/env python3
"""Verifica se a Stripe (id 17) está ativa e com secret_key na API MOVY."""
import json
import urllib.request

URL = "https://api.movymob.com/acquirer"


def main():
    with urllib.request.urlopen(URL, timeout=20) as resp:
        payload = json.loads(resp.read().decode("utf-8"))

    data = payload.get("data") or payload.get("response") or []
    active = [x for x in data if int(x.get("active") or 0) == 1]
    stripes = [
        x
        for x in data
        if int(x.get("idFinancialIntermediary") or 0) == 17
        or "STRIPE" in str(x.get("name") or "").upper()
    ]

    print("Adquirente(s) ativo(s):")
    for a in active:
        print(f"  id={a.get('idFinancialIntermediary')} name={a.get('name')}")

    if not stripes:
        print("Nenhum adquirente Stripe (id 17) encontrado.")
        return 1

    for stripe in stripes:
        fid = stripe.get("idFinancialIntermediary")
        print(f"--- Stripe id={fid} name={stripe.get('name')} active={stripe.get('active')}")
        for m in stripe.get("acquirer_meta_data") or []:
            key = m.get("key")
            val = m.get("value") or ""
            masked = (val[:7] + "…" + val[-4:]) if len(val) > 12 else ("(vazio)" if not val else val)
            print(f"  {key}: {masked}")
            if key in ("secret_key", "stripe_secret_key") and val.startswith("rk_"):
                print("  AVISO: chave rk_ (restricted). Prefira sk_live_/sk_test_ para cobrança.")
        if int(stripe.get("active") or 0) != 1:
            print("  AVISO: Stripe NÃO está ativa. No Monitor selecione STRIPE e salve para ativar.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
