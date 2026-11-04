#!/usr/bin/env python3
"""Genera cableado507.js: cableado borna a borna de la PBB 507 (A380) trazado folio a folio del esquema propio
T87911031230ES (rev. C). Claves "MOD|borna|folio507". Mismo formato de nodos que cableado.js / build_revj.py."""
import json, sys, os, re
def V(spec):
    """'h250' | 'h205/WH' | 'm=EP-W4/27x1,5/2' -> dict de conductor"""
    if spec.startswith("m="):
        parts = spec[2:].split("/")
        m, t, d = (parts[0], "/".join(parts[1:-1]), parts[-1]) if len(parts) >= 3 else (parts + ["", ""])[:3]
        return {"m": m, "t": t.replace("_", " "), "d": d.replace("_", " ")}
    h, _, c = spec[1:].partition("/")
    return {"h": h, "c": c or "RD", "s": "1"}

def el(s, f):
    """Elemento: 'B +E-X51:22 | h268' · 'E +E-K0 22,21 | h250' · 'C 189 RD' · 'P +E-F19:11 | h189'
    · 'F +E-U1:R2A | h733' · 'M UT1 | h683' · 'J E +H-S3 14,13 | m=H-W3//BN ;; E +H-S4 14,13 | m=H-W4//BN'"""
    k, rest = s.split(" ", 1)
    if k == "C":
        return {"k": "C", "w": rest, "f": f}
    if k == "J":
        return {"k": "J", "f": f, "br": [[el(b.strip(), f)] for b in rest.split(";;")]}
    head, *vs = [x.strip() for x in rest.split("|")]
    vv = [V(x) for x in " ".join(vs).split()] if vs else []
    o = {"k": k, "f": f}
    if k == "B":
        t, _, p = head.rpartition(":")
        o.update(t=t, p=p)
    elif k == "E":
        t, _, ps = head.partition(" ")
        o.update(t=t, ps=[x for x in ps.split(",") if x] if ps else [], d="")
    elif k == "F":
        t, _, p = head.rpartition(":")
        o.update(t=t, p=p, d="")
    elif k == "P":
        o.update(t=head)
    elif k == "M":
        o.update(t="", p="", l=head)
    if vv:
        o["v"] = vv
    return o


E = {}
def add(key, c, k, d, chain, note=None):
    m, b, f = key.split("|"); f = int(f); n = []
    if note: n.append({"k": "?", "f": f, "x": note, "v": []})
    if chain: n += [el(x.strip(), f) for x in chain.split(" > ")]
    for x in n:
        if x.get("t") == "+ELEM":
            fo2 = re.search(r"folio (\d+)", note or ""); x.update(t=f"Elemento «{d}»", p="", d=f"ver folio {fo2.group(1) if fo2 else f} del plano 507", f=int(fo2.group(1)) if fo2 else f)
    if chain and not any(x["k"] in "EFJMC" for x in n):
        # solo llega a una borna de continuación: el elemento está en otro folio del plano 507
        fo = re.search(r"folio (\d+)", note or ""); fo = fo.group(1) if fo else str(f)
        n.append({"k": "F", "t": f"Elemento «{d}»", "p": "", "d": f"ver folio {fo} del plano 507", "f": int(fo)})
    E[key] = {"m": m, "b": b, "f": f, "c": c, "k": k, "d": d, "n": n}
def res(key, c, k):
    add(key, c, k, "RESERVA", "")

# ---------- E-A0 entradas (folio 75) · común +24 V hilo 218 (E-X68:1, folio 58) ----------
for b, c, d, ch in [("1.1","DIN01","ESTADO E-K0 CONTACTOR SEGURIDAD","E +E-K0 22,21 | h234"),
                    ("2.1","DIN02","DISYUNTOR VARIADORES","E +E-Q1 14,13 | h259"),
                    ("1.4","DIN03","DISYUNTOR BOMBA","E +E-Q3 14,13 | h260"),
                    ("2.4","DIN04","DISYUNTOR CAPOTA","E +E-Q4.1 14,13 | h255 > E +E-Q4 14,13 "),
                    ("3.1","DIN05","DISYUNTOR PORTON","E +E-Q8 14,13 | h579"),
                    ("3.4","DIN07","ESTADO E-K101 CONTACTOR SEGURIDAD","E +E-K101 22,21 | h681"),
                    ("4.4","DIN08","ESTADO E-K102 CONTACTOR SEGURIDAD","E +E-K102 22,21 | h682")]:
    add(f"E-A0|{b}|75", c, "IN"+c[-2:], d, ch + " > C 218 RD")
add("E-A0|4.1|75", "DIN06", "IN06", "PROTECTOR SOBRETENSIONES", "P +E-F22:11 | h262",
    "La señal llega del contacto de E-F22:11 (folio 28).")
# ---------- E-A0 salidas (folio 76) · retorno 0 V hilo 129 (E-X68:2) ----------
for b, c, d, km, h in [("1.1","DON01","SIRENA MOVIMIENTO","+E-K68","46"),("2.1","DON02","SIRENA FALLO AUTO","+E-K69","286"),
                       ("1.4","DON03","ILUMINACION INTERIOR","+E-K10","289"),("2.4","DON04","ILUMINACION EXTERIOR","+E-K15","290")]:
    add(f"E-A0|{b}|76", c, "OUT"+c[-2:], d, f"E {km} A1,A2 | h{h} > C 129 WH")
# ---------- E-A1 salidas (folios 77-80) ----------
for b, c, d, u, x, h in [("1.1","DON01","VARIADOR U1 ADELANTE","U1","12","123"),("2.1","DON02","VARIADOR U1 ATRAS","U1","13","124"),
                         ("1.2","DON03","VARIADOR U2 ADELANTE","U2","12","142"),("2.2","DON04","VARIADOR U2 ATRAS","U2","13","143"),
                         ("1.3","DON05","VARIADOR U1 VELOCIDAD 1","U1","14","125"),("2.3","DON06","VARIADOR U1 VELOCIDAD 2","U1","15","126"),
                         ("1.4","DON07","VARIADOR U2 VELOCIDAD 1","U2","14","146"),("2.4","DON08","VARIADOR U2 VELOCIDAD 2","U2","15","148")]:
    add(f"E-A1|{b}|77", c, "OUT"+c[-2:], d, f"F +E-{u}:X1A.{x} | h{h}")
res("E-A1|3.1|78", "DON09", "OUT09"); res("E-A1|4.1|78", "DON10", "OUT10")
add("E-A1|3.2|78", "DON11", "OUT11", "ILUMINACION TUNEL FIJO",
    "B +E-X51:6 | h518 > B +IT-X51:6 | m=EIT-W1/H07RN-F_24x1,5/6 > B +CO-X51:1 | m=COIT-W3/RZ1-K_5x1,5/BN > E +CO-K10 A1,A2 | h518 > B +CO-X51:2 | h129/WH > B +IT-X51:7 | m=COIT-W3/RZ1-K_5x1,5/BK > B +E-X51:7 | m=EIT-W1/H07RN-F_24x1,5/7 > C 129 WH")
for b, c, d, km, kk, h in [("4.2","DON12","CAPOTA IZDA DESPLEGAR","+E-K41/42","K1","151"),("3.3","DON13","CAPOTA IZDA RECOGER","+E-K41/42","K2","153"),
                           ("4.3","DON14","CAPOTA DCHA DESPLEGAR","+E-K43/44","K1","219"),("3.4","DON15","CAPOTA DCHA RECOGER","+E-K43/44","K2","295")]:
    add(f"E-A1|{b}|78", c, "OUT"+c[-2:], d, f"E {km} A1({kk}),A2({kk}) | h{h} > C 129 WH")
add("E-A1|4.4|78", "DON16", "OUT16", "TEST BARRERA SEGURIDAD ROTONDA", "B +E1-X70.1:3 | h580", "Continúa en el folio 113 (507).")

CBTHK = {"+E-K85":("+E-X61:2","433","434"),"+E-K86":("+E-X61:3","432","388"),"+E-K87":("+E-X61:4","431","434"),
         "+E-K88":("+E-X61:5","426","388"),"+E-K89":("+E-X61:10","402","434")}
for b, c, d, km, h in [("5.1","DON17","PASARELA ACTIVADA","+E-K85","436"),("6.1","DON18","PASARELA EN SERVICIO","+E-K86","437"),
                       ("5.2","DON19","PASARELA MANTENIMIENTO","+E-K87","438"),("6.2","DON20","PBB ANOMALIA","+E-K88","439"),
                       ("5.3","DON21","FALLO AUTO","+E-K89","441"),("6.3","DON22","RESERVA (relé E-K90)","+E-K90","435"),
                       ("5.4","DON23","RESERVA (relé E-K91)","+E-K91","451"),("6.4","DON24","LUCES FLASH","+E-K60","122")]:
    x = CBTHK.get(km)
    nt = (f"Relé de interfaz con el CBTH: contacto {km} 11-14 entre {x[0]} (hilo {x[1]}) y el común hilo {x[2]} "
          f"(E-X61:{'1' if x[2]=='434' else '11'}), folio 21.") if x else None
    add(f"E-A1|{b}|79", c, "OUT"+c[-2:], d, f"E {km} A1,A2 | h{h} > C 129 WH", nt)
res("E-A1|7.1|80", "DON25", "OUT25"); res("E-A1|8.1|80", "DON26", "OUT26"); res("E-A1|8.2|80", "DON28", "OUT28")
E["E-A1|7.1|80"]["d"] = "CALDEO ARMARIO Y PUPITRE (sin cablear)"; E["E-A1|8.1|80"]["d"] = "RETORNO AUTONOMO (sin cablear: va por 7.2)"
add("E-A1|7.2|80", "DON27", "OUT27", "RETORNO AUTONOMO",
    "B +E-X58:8 | h251 > J F +E-U1:X1A.16 | h251 ;; F +E-U2:X1A.16 | h251 ;; B +E-X105:5 | h251",
    "Desde E-X58:8 se reparte a U1 X1A.16 (folio 45), U2 X1A.16 (folio 46) y E-X105:5 (folio 50).")
add("E-A1|7.3|80", "DON29", "OUT29", "AUTORIZACION ROTONDA",
    "B +E1-X70.1:8 | h584 > B +IT-X50:8 | m=EIT-W10/SUPER-PAAR-TRONIC_20x0,75/PK > E +R-S2 X1,X2 | m=ITR-W5/H07RN-F_5x1,5/BN > B +IT-X50:9 | m=ITR-W5/H07RN-F_5x1,5/BU > B +E1-X70.1:9 | m=EIT-W10/SUPER-PAAR-TRONIC_20x0,75/BU > C 129 WH")
add("E-A1|8.3|80", "DON30", "OUT30", "ILUMINACION ESCALERA TUNEL FIJO",
    "B +E-X51:8 | h519 > B +IT-X51:8 | m=EIT-W1/H07RN-F_24x1,5/8 > B +CO-X51:3 | m=COIT-W3/RZ1-K_5x1,5/GY > E +CO-K18 A1,A2 | h519 > B +CO-X51:4 | h129/WH > B +IT-X51:9 | m=COIT-W3/RZ1-K_5x1,5/BU > B +E-X51:9 | m=EIT-W1/H07RN-F_24x1,5/9 > C 129 WH")
add("E-A1|7.4|80", "DON31", "OUT31", "SUBIR PORTON", "E +E-K81/2 A1(K1),A2(K1) | h585 > C 129 WH")
add("E-A1|8.4|80", "DON32", "OUT32", "BAJAR PORTON", "E +E-K81/2 A1(K2),A2(K2) | h586 > C 129 WH")

# ---------- E-A2 entradas (folios 81-82) ----------
add("E-A2|1.1|81", "DIN01", "IN01", "RELE ASIMETRIA", "P +E-F11:18 | h430", "La señal llega del relé de asimetría E-F11:18 (folio 28).")
add("E-A2|2.1|81", "DIN02", "IN02", "VARIADOR U1 FALLO", "F +E-U1:X1B.21 | h128")
add("E-A2|1.4|81", "DIN03", "IN03", "VARIADOR U2 FALLO", "F +E-U2:X1B.21 | h150")
SNOTE = "Sensor inductivo PNP SICK IME18 (M12): + pin 1 BN hilo 218, − pin 3 BU hilo 129, salida Q pin 2 WH."
for b, c, k, d, xb, h, s, w in [("2.4","DIN04","IN04","GIRO ROTONDA IZDA","20","494","+CO-B1","COIT-W5"),
                                ("3.1","DIN05","IN05","GIRO ROTONDA DCHA","21","495","+CO-B2","COIT-W6"),
                                ("4.1","DIN06","IN06","SENSOR INCLINACION","23","496","+IT-B10","ITIT-W5")]:
    add(f"E-A2|{b}|81", c, k, d, f"B +E-X51:{xb} | h{h} > B +IT-X51:{xb} | m=EIT-W1/H07RN-F_24x1,5/{xb} > E {s} 2,1 | m={w}/SAC-5P-M12FR/WH > B +IT-X51:1 | m={w}/SAC-5P-M12FR/BN > C 218 RD", SNOTE)
for b, c, k, d, xb, h, s, w in [("3.4","DIN07","IN07","SENSOR 1 EXTENSION/RETRACCION","9","497","+ET-B6","ETET-W5"),
                                ("4.4","DIN08","IN08","SENSOR 2 EXTENSION/RETRACCION","10","498","+ET-B7","ETET-W6")]:
    add(f"E-A2|{b}|81", c, k, d, f"B +E-X54:{xb} | h{h} > B +ET-X51:{xb} | m=EET-W1/H07RN-F_12x1,5/{xb} > E {s} 2,1 | m={w}/SAC-5P-M12FR/WH > B +ET-X51:1 | m={w}/SAC-5P-M12FR/BN > C 218 RD", SNOTE)
add("E-A2|5.1|82", "DIN09", "IN09", "ESTADO E-K26 RETORNO AUTONOMO", "E +E-K26 52,51 | h686 > C 218 RD")
add("E-A2|6.1|82", "DIN10", "IN10", "LIMITE CABINA IZDA", "B +E-X62:7 | h306", "Continúa en el folio 85 (507).")
add("E-A2|5.4|82", "DIN11", "IN11", "LIMITE CABINA DCHA", "B +E-X62:8 | h307", "Continúa en el folio 85 (507).")
for b, c, k, d, x, h, s, w in [("6.4","DIN12","IN12","FC CAPOTA IZQUIERDA","3","275","+C-S15","CP-W42"),
                               ("7.1","DIN13","IN13","FC CAPOTA DERECHA","4","276","+C-S16","CP-W43")]:
    add(f"E-A2|{b}|82", c, k, d, f"B +E-X64:{x} | h{h} > B +P-X64:{x} | m=EP-W5/H07RN-F_12x1,5/{x} > E {s} 21,22 | m={w}/H07RN-F_2x1,5/BU > B +P-X64:1 | m={w}/H07RN-F_2x1,5/BN > C 218 RD")
add("E-A2|8.1|82", "DIN14", "IN14", "VARIADOR U1 FRENO PERDIDO", "F +E-U1:X1B.17 | h121")
add("E-A2|7.4|82", "DIN15", "IN15", "PULSADOR ILUMINACION ESCALERA TUNEL FIJO",
    "B +E-X51:17 | h270 > B +IT-X51:17 | m=EIT-W1/H07RN-F_24x1,5/17 > B +TF2-X51:12 | m=ITTF2-W2/RZ1-K_3x2,5/BN > J E +TF-S1 N,L1 | m=TFTF2-W3/RZ1-K_3x2,5/BN ;; E +TF-S2 N,L1 | m=TFTF2-W31/RZ1-K_3x2,5/BN > B +TF2-X51:11 | m=TFTF2-W3/RZ1-K_3x2,5/BU > B +IT-X51:1 | m=ITTF2-W2/RZ1-K_3x2,5/BU > C 218 RD",
    "Los dos pulsadores TF-S1 y TF-S2 están en paralelo.")
add("E-A2|8.4|82", "DIN16", "IN16", "DETECTORES DE MOVIMIENTO",
    "B +E-X51:5 | h91 > B +IT-X51:5 | m=EIT-W1/H07RN-F_24x1,5/5 > B +IT-X85:4 | h91", "Continúa en el folio 39 (507).")

# ---------- E-A3 entradas (folios 83-84) ----------
add("E-A3|1.1|83", "DIN01", "IN01", "BLOQUEO PBB SETA AO", "B +E-X61:6 | h425", "Señal del CBTH por E-X61:6 (folio 21).")
add("E-A3|2.1|83", "DIN02", "IN02", "ESTADO E-K33 RETORNO OUTRIGGER", "E +E-K33 22,21 | h685 > C 218 RD")
add("E-A3|1.4|83", "DIN03", "IN03", "SETAS TRASLACION",
    "B +E-X55:11 | h285 > B +H-X51:11 | m=EH-W1/H07RN-F_27x1,5/11 > J E +H-S3 14,13 | m=HH-W3/H07RN-F_5x1,5/BN ;; E +H-S4 14,13 | m=HH-W4/H07RN-F_5x1,5/BN > B +H-X51:1 | m=HH-W3/H07RN-F_5x1,5/BU > C 218 RD",
    "Setas H-S3 (izquierda) y H-S4 (derecha) de elevación, en paralelo.")
add("E-A3|2.4|83", "DIN04", "IN04", "VARIADOR U2 FRENO PERDIDO", "F +E-U2:X1B.17 | h152")
add("E-A3|3.1|83", "DIN05", "IN05", "ESTADO E-K1", "E +E-K1 22,21 | h409 > C 218 RD")
add("E-A3|4.1|83", "DIN06", "IN06", "ESTADO E-K3", "E +E-K3 22,21 | h263 > C 218 RD")
add("E-A3|3.4|83", "DIN07", "IN07", "ESTADO E-K24", "E +E-K24 R2,R1 | h265 > C 218 RD")
add("E-A3|4.4|83", "DIN08", "IN08", "ESTADO PROTECCIONES 24VDC", "P +E-Q30.0:Alarm | h573", "Contacto de alarma de la fuente/protecciones E-Q30.0 (folio 55).")
for b, c, k, d, x, h, s, ps, w, wd in [("5.1","DIN09","IN09","FRENO ELEC. MOTOR IZDO","7","200","+T-S5","BU,BK","HT-W19","3"),
                                       ("6.1","DIN10","IN10","FRENO MANUAL MOTOR IZDO","8","277","+T-S6","GR,BK","HT-W19","5"),
                                       ("5.4","DIN11","IN11","FRENO ELEC. MOTOR DCHO","9","278","+T-S7","BU,BK","HT-W20","3"),
                                       ("6.4","DIN12","IN12","FRENO MANUAL MOTOR DCHO","10","279","+T-S8","GR,BK","HT-W20","5")]:
    add(f"E-A3|{b}|84", c, k, d, f"B +E-X55:{x} | h{h} > B +H-X51:{x} | m=EH-W1/H07RN-F_27x1,5/{x} > E {s} {ps} | m={w}/H07RN-F_7x1,5/{wd} > B +H-X51:1 | m={w}/H07RN-F_7x1,5/4_218 > C 218 RD")
for b, c, k, d, x, h, s, w in [("7.1","DIN13","IN13","LIMITE GIRO TRASLACION IZDA","18","280","+H-B3","HH-W16"),
                               ("8.1","DIN14","IN14","LIMITE GIRO TRASLACION DCHA","19","281","+H-B4","HH-W17"),
                               ("7.4","DIN15","IN15","CONTAJE TRASLACION IZDA","16","282","+H-B1","HH-W14"),
                               ("8.4","DIN16","IN16","CONTAJE TRASLACION DCHA","17","283","+H-B2","HH-W15")]:
    add(f"E-A3|{b}|84", c, k, d, f"B +E-X55:{x} | h{h} > B +H-X51:{x} | m=EH-W1/H07RN-F_27x1,5/{x} > E {s} 2,1 | m={w}/SAC-5P-M12FR/BK > B +H-X51:1 | m={w}/SAC-5P-M12FR/BN_218 > C 218 RD",
        "Sensor inductivo PNP (M12): + pin 1 BN hilo 218 (H-X51:1), − pin 3 BU hilo 129 (H-X51:2), salida Q pin 2 BK.")

# ---------- E-A4 analógicas (folio 85) · cable EE-W30 SUPER-PAAR-TRONIC-C-PUR 6x2x0,5 del módulo a E-X62 ----------
EW = "EE-W30/SUPER-PAAR-TRONIC-C-PUR_6x2x0,5"
add("E-A4|1.1|85", "AI01", "AIN01", "INCLINOMETRO (analógica)",
    f"B +E-X62:2 | m={EW}/WH > B +IT-X62:2 | m=EIT-W2/SUPER-PAAR-TRONIC_340-C-PUR_1x2x1/WH > F +IT-R3:AO-Y | m=ITIT-W30/INY030D-F99-2I2E2-5M/PK",
    "Inclinómetro IT-R3 (INY030D): +UB BN hilo 218 desde IT-X62:1 (IT-X51:1), señal hilo 302 (PK→WH), retorno −I1 (borna 2.1) hilo 129 por E-X62:3 / IT-X62:3 (GY).")
add("E-A4|1.2|85", "AI02", "AIN02", "POTENCIOMETRO GIRO CABINA (analógica 4-20 mA)",
    f"B +E-X62:4 | m={EW}/GN > F +C-R10:5 | m=EC-W9/SAC-5P-M12FR/GY",
    "Potenciómetro de giro de cabina C-R10: pin 1 +UB BN hilo 218 (E-X62:5), pin 3 −UB BU hilo 129, salida 4-20 mA pin 5 GY hilo 304. Retorno −I2 (borna 2.2) hilo 129 por E-X62:6. Las salidas QS1 (pin 2, hilo 306) y QS2 (pin 4, hilo 307) son los límites de cabina de E-A2 6.1 / 5.4.")
add("E-A4|1.3|85", "AI03", "AIN03", "MEDIDOR ELONGACION (analógica)",
    f"B +E-X62:11 | m={EW}/PK > F +ET-B9:2 | m=EET-W8/SAC-5P-M12FS/WH",
    "Láser de elongación SICK DL50 ET-B9: pin 1 + BN hilo 218 (E-X62:9), pin 3 − BU hilo 129, salida analógica QA pin 2 hilo 312. Retorno −I3 (borna 2.3) hilo 129 por E-X62:10.")
add("E-A4|1.4|85", "AI04", "AIN04", "ANEMOMETRO (analógica)",
    f"B +E-X62:16 | m={EW}/BU > F +E-U7:9 | h407",
    "Anemómetro ET-V1 (cable EET-W65 a E-X62:12/13/14: 218 WH, 129 BN, 310 GY) leído por el relé tacométrico E-U7 SC320 (bornas 2/10/7). Salida E-U7:9 hilo 407; retorno −I4 (borna 2.4) desde E-U7:8 hilo 129 por E-X62:17.")
# límites de cabina (E-A2) completos: salen del potenciómetro C-R10
add("E-A2|6.1|82", "DIN10", "IN10", "LIMITE CABINA IZDA",
    "B +E-X62:7 | h306 > E +C-R10 2,1 | m=EC-W9/SAC-5P-M12FR/WH > B +E-X62:5 | m=EC-W9/SAC-5P-M12FR/BN > C 218 RD",
    "Salida QS1 del potenciómetro de giro de cabina C-R10 (folio 85).")
add("E-A2|5.4|82", "DIN11", "IN11", "LIMITE CABINA DCHA",
    "B +E-X62:8 | h307 > E +C-R10 4,1 | m=EC-W9/SAC-5P-M12FR/BK > B +E-X62:5 | m=EC-W9/SAC-5P-M12FR/BN > C 218 RD",
    "Salida QS2 del potenciómetro de giro de cabina C-R10 (folio 85).")
# ---------- E-A5 alimentación módulo de seguridades (folio 86) ----------
add("E-A5|1.1|86", "US", "US", "ALIMENTACION MODULO SEGURIDADES (UM 1.2 · US 2.1 · GND 1.3)",
    "B +E-X68:4 | h568 > C 568 RD",
    "IB IL 24 PWR IN: UM 1.2 y US 2.1 con +24 V hilo 568 desde E-X68:4 (folio 56); GND 1.3 hilo 129 a E-X68:2; FE 1.4 a E-X91:10.")

# ---------- E-A6 salidas de seguridad (folios 87-88) · retorno a la GND del propio canal ----------
SOUT = "Salida de seguridad (IB IL 24 LPSDO 8): la bobina vuelve a la borna GND del mismo canal, no al 0 V común. Mide entre la salida y su GND."
for b, c, k, d, km, h, g, hg, f in [("1.1","DOS01","OUT0_Ch1","VARIADORES FRECUENCIA","+E-K1","250","1.3","587",87),
                                    ("2.1","DOS02","OUT0_Ch2","FRENOS TRASLACION","+E-K24","293","2.3","588",87),
                                    ("3.1","DOS03","OUT1_Ch1","CONTACTOR SEGURIDAD 1","+E-K0","589","3.3","590",87),
                                    ("4.1","DOS04","OUT1_Ch2","CONTACTOR SEGURIDAD 2","+E-K101","591","4.3","592",87),
                                    ("5.1","DOS05","OUT2_Ch1","CONTACTOR SEGURIDAD 3","+E-K102","593","5.3","594",88),
                                    ("6.1","DOS06","OUT2_Ch2","RETORNO OUTRIGGER","+E-K33","683","6.3","684",88),
                                    ("8.1","DOS08","OUT3_Ch2","BOMBA HIDRAULICA","+E-K3","393","8.3","595",88)]:
    add(f"E-A6|{b}|{f}", c, k, d, f"E {km} A1,A2 | h{h} > M E-A6 GND {g} | h{hg}/WH", SOUT)
add("E-A6|7.1|88", "DOS07", "OUT3_Ch1", "SIRENA SEGURIDAD CABINA", "B +E1-X70.1:22 | h596",
    "Sale por E1-X70.1:22 (folio 115); el retorno vuelve a la GND 7.3 por E1-X70.1:23 hilo 597 y la FE 7.4 a E1-X70.1:26.")

# ---------- E-A7 salidas de seguridad (folios 89-90) ----------
for b, c, k, d, x, h, g, xg, hg, f in [("1.1","DOS01","OUT0_Ch1","VALVULA BAJAR","15","238","1.3","19","604",89),
                                       ("2.1","DOS02","OUT0_Ch2","BAJADA RAPIDA IZQUIERDA/DERECHA","20","246","2.3","21","605",89),
                                       ("5.1","DOS05","OUT2_Ch1","BAJADA RAPIDA","22","239","5.3","23","606",90)]:
    add(f"E-A7|{b}|{f}", c, k, d, f"B +E-X56:{x} | h{h}",
        f"Electroválvula por E-X56:{x} (folio 70); el retorno vuelve a la borna 0 V {g} del módulo por E-X56:{xg} hilo {hg}. Mide entre E-X56:{x} y E-X56:{xg}.")
add("E-A7|3.1|89", "DOS03", "OUT1_Ch1", "SETA VDGS", "E +E-K90.1 0,1 | h602 > M E-A7 0V 3.3 | h603/WH",
    "Relé E-K90.1 (OMRON G7S): su contacto 52-51 va a E1-X68.1:10/11 (hilos 601/600) → manguera EP-W6 cond. 10/11 → P-X92.1:10/11, seta VDGS del pupitre.")
add("E-A7|4.1|89", "DOS04", "OUT1_Ch2", "RETORNO AUTONOMO", "E +E-K26 A1,A2 | h611 > M E-A7 0V 4.3 | h680/WH", SOUT)
for b, c, k in [("6.1","DOS06","OUT2_Ch2"),("7.1","DOS07","OUT3_Ch1"),("8.1","DOS08","OUT3_Ch2")]: res(f"E-A7|{b}|90", c, k)

# ---------- E-A8 entradas de seguridad (folio 91) ----------
add("E-A8|1.1|91", "DIS01", "IN01S", "SENSOR PORTON ENROLLABLE",
    "B +E1-X68.1:2 | h608 > B +P-X92.1:2 | m=EP-W6/H07RN-F_27x1,5/2 > F +C-S9:4 | m=P-W21/SAC-5P-10,0-PUR/M12FS_SH/BK",
    "Sensor C-S9 (salida QS2 pin 4): +UB pin 1 BN hilo 568 (E-X68:4 → E1-X68.1:1 → P-X92.1:1), −UB pin 3 BU hilo 607 (P-X92.1:3 → E1-X68.1:3 → GND 1.3 del módulo).")
def utc(key, c, k, d, xin, hin, xut, hut, ut, fo):
    add(key, c, k, d, f"B {xin} | h{hin} > F +ELEM:x > B {xut} > M {ut} | h{hut}",
        f"Pareja IN/UT: la entrada vuelve por {xin} (hilo {hin}) y el pulso de test sale de {ut} por {xut} (hilo {hut}). Recorrido en el folio {fo} (507). Mide entre {xin} y {xut}: con el elemento cerrado, la señal pulsada de 24 V.")
utc("E-A8|2.1|91", "DIS02", "IN02S", "BORDE RUEDAS", "+E1-X117:2", "385", "+E1-X117:1", "376", "UT2 2.2", 62)
add("E-A8|3.1|91", "DIS03", "IN03S", "BYPASS SEGURIDADES",
    "B +E-X59:14 | h609 > B +P-X51:14 | m=EP-W1/H07RN-F_24x1,5/14 > B +P-X53:3 | h609 > E +CP-S33 13,14 | h609 > B +P-X53:4 | h610 > B +P-X51:15 | h610 > B +E-X59:15 | m=EP-W1/H07RN-F_24x1,5/15 > M UT1 3.2 | h610")
utc("E-A8|4.1|91", "DIS04", "IN04S", "SETAS EMERGENCIA", "+E-X55:14", "212", "+E-X61:9", "376", "UT2 4.2", 67)
utc("E-A8|5.1|91", "DIS05", "IN05S", "F.C. TRASLACION", "+E-X55:12", "231", "+E-X55:13", "614", "UT1 5.2", 66)
utc("E-A8|6.1|91", "DIS06", "IN06S", "F.C. EXTENSION", "+E-X54:7", "230", "+E-X54:8", "232", "UT2 6.2", 66)
utc("E-A8|7.1|91", "DIS07", "IN07S", "F.C. ROTONDA", "+E-X51:16", "612", "+E-X51:22", "613", "UT1 7.2", 66)
utc("E-A8|8.1|91", "DIS08", "IN08S", "F.C. INCLINACION", "+E-X51:12", "229", "+E-X51:13", "375", "UT2 8.2", 66)
# ---------- E-A9 entradas de seguridad (folio 92) ----------
add("E-A9|1.1|92", "DIS01", "IN01S", "PULSADOR LUMINOSO OK RETIRADA PBB",
    "B +E-X57:19 | h616 > B +P-X67:19 | m=EP-W4/RZ1-K_24x2,5/19 > B +P-X92.3:3 | h616 > E +H-S11 14,13 | m=PH-W1//3 > B +P-X92.3:4 | m=PH-W1//4 > B +P-X67:20 | h615 > B +E-X57:20 | m=EP-W4/RZ1-K_24x2,5/20 > M UT1 1.2 | h615")
ANT = "Antiatrapamiento óptico NPN (sin UT): la señal llega directa por {x} (folio 64, 507)."
for b, c, d, x, h in [("2.1","DIS02","ANTIATRAPAMIENTO TUNEL MEDIO IZQUIERDO","+E-X58:4","182"),
                      ("5.1","DIS05","ANTIATRAPAMIENTO TUNEL INTERIOR IZQUIERDO","+E-X51:4","158"),
                      ("6.1","DIS06","ANTIATRAPAMIENTO TUNEL INTERIOR DERECHO","+E-X51:19","159"),
                      ("8.1","DIS08","ANTIATRAPAMIENTO TUNEL MEDIO DERECHO","+E-X58:6","183")]:
    add(f"E-A9|{b}|92", c, "IN0"+b[0]+"S", d, f"B {x} | h{h}", ANT.format(x=x))
add("E-A9|3.1|92", "DIS03", "IN03S", "AUTORIZACION ROTONDA",
    "B +E1-X70.1:12 | h618 > B +IT-X50:12 | m=EIT-W10/SUPER-PAAR-TRONIC_340-C-PUR_20x0,75/VT > E +R-S2 14,13 | m=ITR-W5/H07RN-F_5x1,5/GY > B +IT-X50:13 | m=ITR-W5/H07RN-F_5x1,5/BK > B +E1-X70.1:13 | m=EIT-W10/SUPER-PAAR-TRONIC_340-C-PUR_20x0,75/GYPK > M UT1 3.2 | h617")
utc("E-A9|4.1|92", "DIS04", "IN04S", "SIRENA SEGURIDAD CABINA", "+E1-X70.1:25", "598", "+E1-X70.1:24", "599", "UT2 4.2", 115)
utc("E-A9|7.1|92", "DIS07", "IN07S", "BUMPER ALA A-380", "+E-X59:4", "217", "+E-X59:3", "576", "UT1 7.2", 63)

# ---------- E-A10 entradas de seguridad (folio 93; bumpers en el folio 116) ----------
EW6 = "EP-W6/H07RN-F_27x1,5"
add("E-A10|1.1|93", "DIS01", "IN01S", "BUMPER BRAZO AUTONIVELADOR",
    f"B +E1-X68.1:12 | h619 > B +P-X92.1:12 | m={EW6}/12 > E +C-B27 1,2 | m=CP-W60/FABRICANTE_2x/619_BK > B +P-X51:25 | m=CP-W60/FABRICANTE_2x/623_BK > E +C-B28 2,1 | m=CP-W61/FABRICANTE_2x/623_BK > B +P-X92.1:13 | m=CP-W61/FABRICANTE_2x/620_BK > B +E1-X68.1:13 | m={EW6}/13 > M UT1 1.2 | h620",
    "Bumpers del brazo (folio 116, 507): 2 en serie. P-X92.1:12 (IN 619) · C-B27 · P-X51:25 (623) · C-B28 · P-X92.1:13 (UT 620). Para saber cuál falla: puente P-X92.1:12 ↔ P-X51:25 (anula C-B27) o P-X51:25 ↔ P-X92.1:13 (anula C-B28), no en el PLC.")
add("E-A10|2.1|93", "DIS02", "IN02S", "BUMPER LATERAL IZDO CABINA",
    f"B +E1-X68.1:14 | h621 > B +P-X92.1:14 | m={EW6}/14 > E +C-B30 1,2 | m=CP-W62/FABRICANTE_2x/621_BK > B +P-X51:26 | m=CP-W62/FABRICANTE_2x/624_BK > E +C-B29 2,1 | m=CP-W63/FABRICANTE_2x/624_BK > B +P-X92.1:15 | m=CP-W63/FABRICANTE_2x/622_BK > B +E1-X68.1:15 | m={EW6}/15 > M UT2 2.2 | h622",
    "Bumpers de la cabina (folio 116, 507): 2 en serie. P-X92.1:14 (IN 621) · C-B30 · P-X51:26 (624) · C-B29 · P-X92.1:15 (UT 622). Para saber cuál falla: puente P-X92.1:14 ↔ P-X51:26 (anula C-B30) o P-X51:26 ↔ P-X92.1:15 (anula C-B29), no en el PLC.")
add("E-A10|3.1|93", "DIS03", "IN03S", "BARRERA SEGURIDAD ROTONDA", "B +E1-X70.1:6 | h581", "Continúa en el folio 113 (507).")
add("E-A10|4.1|93", "DIS04", "IN04S", "INDUCTIVO PUERTA SERVICIO",
    "B +E-X68:6 | h626 > F +SS-B15:4 | m=ESS-W20/SAC-5P-10,0-115/M12FR/BK",
    "Sensor SS-B15 (salida QS2 pin 4): +UB pin 1 BN hilo 568 (E-X68:4), −UB pin 3 BU hilo 625 por E-X68:7 a la GND 4.3 del módulo.")
for b, c, k, d, a, z, hi, hu, ut, s1, s2 in [("5.1","DIS05","IN05S","MODO AUTO","16","17","628","627","UT1 5.2","1","2"),
                                              ("6.1","DIS06","IN06S","MODO MANUAL","18","19","630","629","UT2 6.2","6","7"),
                                              ("7.1","DIS07","IN07S","MODO LOCAL REMOTO","20","21","632","631","UT1 7.2","8","9")]:
    ps = {"1":"2,1","6":"4,3","8":"6,5"}[s1]
    add(f"E-A10|{b}|93", c, k, d,
        f"B +E1-X68.1:{a} | h{hi} > B +P-X92.1:{a} | m={EW6}/{a} > B +P-X50:{s1} | h{hi} > E +CP-S16 {ps} | h{hi} > B +P-X50:{s2} | h{hu} > B +P-X92.1:{z} | h{hu} > B +E1-X68.1:{z} | m={EW6}/{z} > M {ut} | h{hu}",
        "Selector de modo CP-S16 del pupitre (conector P-X50).")
add("E-A10|8.1|93", "DIS08", "IN08S", "ZAPATA ACTIVADA", "B +E-U5:14 | h578",
    "Pareja IN/UT: la entrada vuelve de E-U5:14 (hilo 578) y el pulso de test UT2 8.2 sale a E-U5:13 (hilo 577), folio 65 (507).")
# ---------- P-A0 alimentación del pupitre (folio 95) ----------
add("P-A0|4.1|95", "US", "US", "ALIMENTACION PLC PUPITRE (US 4.1 · UM 4.2 · GND 4.3)", "B +P-X92:1 | h184 > C 184 RD",
    "IB IL 24 LSKIP: segmento 4 US y UM con +24 V hilo 184 (P-X92:1), GND hilo 129 (P-X92:2), FE a P-X92:20. Segmento 3: UL hilo 575 desde P-Q30.1 (folio 57), GND hilo 129.")

# ---------- P-A1 salidas del pupitre (folios 96-99) · retorno 0 V hilo 129 (P-X92:2) ----------
add("P-A1|1.1|96", "DON01", "OUT01", "SEÑAL ALARMA (piloto rojo)", "B +P-X59:2 | h353 > E +CP-H2 +,- | h353 > B +P-X59:1 | h129/WH > C 129 WH")
add("P-A1|2.1|96", "DON02", "OUT02", "SEÑAL ESTADO (piloto verde)", "B +P-X59:3 | h354 > E +CP-H1 +,- | h354 > B +P-X59:1 | h129/WH > C 129 WH",
    "El − de CP-H1 sigue también a CP-S43:x2 (folio 100, 507).")
add("P-A1|1.4|96", "DON03", "OUT03", "BUZZER", "E +P-H9 +,- | h355 > C 129 WH")
for b, c, d, km, kk, h, f in [("2.4","DON04","BRAZO ADELANTE","+P-K51/2","K1","356",96),("3.1","DON05","BRAZO ATRAS","+P-K51/2","K2","357",97),
                              ("4.1","DON06","CABINA IZQUIERDA","+P-K61/2","K1","358",97),("3.4","DON07","CABINA DERECHA","+P-K61/2","K2","359",97)]:
    add(f"P-A1|{b}|{f}", c, "OUT"+c[-2:], d, f"E {km} A1({kk}),A2({kk}) | h{h} > C 129 WH")
add("P-A1|4.4|97", "DON08", "OUT08", "BUZZER PBB A-380", "E +P-H50 +,- | h408 > C 129 WH")

add("P-A1|5.1|98", "DON09", "OUT09", "SUELO SUBIR", "E +P-K72 22,21 | h360 > E +P-K71 A1,A2 | h362 > C 129 WH", "Enclavamiento: pasa por el contacto cerrado 21-22 de P-K72 (bajar) antes de la bobina P-K71.")
add("P-A1|6.1|98", "DON10", "OUT10", "SUELO BAJAR", "E +P-K71 22,21 | h361 > E +P-K72 A1,A2 | h363 > C 129 WH", "Enclavamiento: pasa por el contacto cerrado 21-22 de P-K71 (subir) antes de la bobina P-K72.")
add("P-A1|5.4|98", "DON11", "OUT11", "LUNETAS TERMICAS", "E +P-K17 A1,A2 | h500 > C 129 WH")
res("P-A1|6.4|98", "DON12", "OUT12")
for b, c, d, km, h in [("7.1","DON13","FOCO AZAFATA ON","+P-K20","638"),("8.1","DON14","FOCO AZAFATA ROJO","+P-K21","639"),
                       ("7.4","DON15","FOCO AZAFATA VERDE","+P-K22","640"),("8.4","DON16","FOCO AZAFATA AZUL","+P-K23","641")]:
    add(f"P-A1|{b}|99", c, "OUT"+c[-2:], d, f"E {km} A1,A2 | h{h} > C 129 WH", "Contactos del relé al foco de azafata en el folio 114 (507).")

# ---------- P-A2 salidas (folios 100-103) ----------
CBP = "Relé de interfaz con el CBTH: contacto {k} 11-14 a P-X60:{x} (hilo {h}), común hilo 434 que llega de E-X61:1 por E1-X68.1:26 → EP-W6 cond. 26 → P-X92.1:26 (folio 22)."
for b, c, d, km, h, x, hx, f in [("1.1","DON01","SEÑAL ABANDONO OPERADOR","+P-K80","642","11","389",100),
                                 ("2.1","DON02","SEÑAL PRESENCIA DESCONEXION","+P-K81","643","12","61",100),
                                 ("1.4","DON03","SEÑAL PRESENCIA CONEXION","+P-K82","644","13","60",100),
                                 ("2.4","DON04","SEÑAL PULSADOR LUMINOSO OK HANDLING","+P-K83","645","14","59",100),
                                 ("3.1","DON05","SEÑAL OK RETIRADA PBB","+P-K84","648","15","58",101),
                                 ("4.1","DON06","ZAPATA ACTIVADA","+P-K85","649","16","57",101)]:
    nt = CBP.format(k=km, x=x, h=hx)
    if km == "+P-K83": nt += " Su contacto 21-22 enciende el piloto azul CP-S43 (hilo 646, P-X53:9) con +24 V hilo 184."
    if km == "+P-K84": nt += " Su contacto 21-22 enciende el piloto de H-S11 (hilo 647, P-X92.3:1 → PH-W1) con +24 V hilo 184."
    add(f"P-A2|{b}|{f}", c, "OUT"+c[-2:], d, f"E {km} A1,A2 | h{h} > C 129 WH", nt)
add("P-A2|3.4|101", "DON07", "OUT07", "LUZ AZUL BAJO CABINA FIJA", "E +P-K68 A1,A2 | h650 > C 129 WH", "Contactos del relé a la luz azul en el folio 120 (507).")
add("P-A2|4.4|101", "DON08", "OUT08", "LUZ AZUL BAJO CABINA INTERMITENTE", "E +P-K69 A1,A2 | h651 > C 129 WH", "Contactos del relé a la luz azul en el folio 120 (507).")

DUP = " Ojo: en el plano 507 los folios 102 y 103 dan los mismos canales P-A2 5.1 / 6.1 / 5.4 a señales distintas (rotonda roja/verde/variador bomba y outriggers). Comprueba en campo qué hilo llega a la borna."
add("P-A2|5.1|102", "DON09", "OUT09", "SEÑAL LUMINOSA EN ROTONDA ROJA", "B +P-X92.1:23 | h654", "Continúa en el folio 120 (507)." + DUP)
add("P-A2|6.1|102", "DON10", "OUT10", "SEÑAL LUMINOSA EN ROTONDA VERDE", "B +P-X92.1:25 | h655", "Continúa en el folio 120 (507)." + DUP)
add("P-A2|5.4|102", "DON11", "OUT11", "ACTIVAR VARIADOR BOMBA", "B +P-X64:6 | h399 > B +E-X64:6 | m=EP-W5/H07RN-F_12x1,5/6 > B +E-X105:4 | h399",
    "Orden de marcha del variador de la bomba E1-U6 por E-X105:4 (folio 50, 507)." + DUP)
res("P-A2|6.4|102", "DON12", "OUT12")
for b, c, d, km, x, h in [("5.1","DON09","OUTRIGGER UP","+E-K66","7","64"),("6.1","DON10","OUTRIGGER DOWN","+E-K67","8","66"),
                          ("5.4","DON11","OUTRIGGER ACTIVADO","+E-K65","9","201")]:
    add(f"P-A2|{b}|103", c, "OUT"+c[-2:], d, f"B +P-X64:{x} | h{h} > B +E-X64:{x} | m=EP-W5/H07RN-F_12x1,5/{x} > E {km} A1,A2 | h{h} > C 129 WH",
        "Relé de outriggers en el armario E; el 0 V hilo 129 es el del armario (E-X51:9 / E-X62:13)." + DUP)

# ---------- P-A3 entradas del pupitre (folios 104-105) · común +24 V hilo 184 (P-X92:1) ----------
add("P-A3|1.1|104", "DIN01", "IN01", "SETA PUPITRE", "B +P-X53:6 | h400 > E +CP-S5 14,13 | h400 > B +P-X53:1 | h184 > C 184 RD")
for b, c, d, x, h in [("2.1","DIN02","HOMBRE MUERTO","2","315"),("1.4","DIN03","PBB ADELANTE","3","401"),("2.4","DIN04","PBB ATRAS","4","403"),
                      ("3.1","DIN05","PBB IZQUIERDA","5","404"),("4.1","DIN06","PBB DERECHA","6","452"),("3.4","DIN07","JOYSTICK X1","7","320"),
                      ("4.4","DIN08","JOYSTICK X2","8","321")]:
    add(f"P-A3|{b}|104", c, "IN"+c[-2:], d, f"B +P-X54:{x} | h{h}", "Señal del joystick por P-X54 (folio 73, 507).")
for b, c, d, x, h in [("5.1","DIN09","JOYSTICK Y1","9","322"),("6.1","DIN10","JOYSTICK Y2","10","323")]:
    add(f"P-A3|{b}|105", c, "IN"+c[-2:], d, f"B +P-X54:{x} | h{h}", "Señal del joystick por P-X54 (folio 73, 507).")
res("P-A3|5.4|105", "DIN11", "IN11"); res("P-A3|6.4|105", "DIN12", "IN12")
for b, c, d, s, x, h in [("7.1","DIN13","PBB SUBIR","+CP-S11","4","316"),("8.1","DIN14","PBB BAJAR","+CP-S12","5","314"),
                         ("7.4","DIN15","CABINA IZQUIERDA","+CP-S9","6","328"),("8.4","DIN16","CABINA DERECHA","+CP-S10","7","329")]:
    add(f"P-A3|{b}|105", c, "IN"+c[-2:], d, f"B +P-X57:{x} | h{h} > E {s} 14,13 | h{h} > B +P-X57:1 | h184 > C 184 RD",
        "Pulsador del pupitre; el +24 V hilo 184 llega a P-X57:1 desde P-X92:4.")

# ---------- P-A4 entradas del pupitre (folios 106-107) ----------
for b, c, d, s, x, h in [("1.1","DIN01","SUBIR SUELO","+CP-S14","2","334"),("2.1","DIN02","BAJAR SUELO","+CP-S15","3","335"),
                         ("1.4","DIN03","ILUMINACION INTERIOR","+CP-S17","4","336"),("2.4","DIN04","DESPLEGAR CAPOTA","+CP-S7","7","337"),
                         ("3.1","DIN05","RECOGER CAPOTA","+CP-S8","8","338"),("4.1","DIN06","ILUMINACION EXTERIOR","+CP-S18","9","339"),
                         ("3.4","DIN07","LUNETAS TERMICAS","+CP-S31","5","271"),("4.4","DIN08","PRIORIDAD RETORNO","+CP-S21","6","341")]:
    add(f"P-A4|{b}|106", c, "IN"+c[-2:], d, f"B +P-X56:{x} | h{h} > E {s} 13,14 | h{h} > B +P-X56:1 | h184 > C 184 RD",
        "Pulsador del pupitre (conector P-X56); el +24 V hilo 184 llega a P-X56:1 desde P-X92:1.")
add("P-A4|5.1|107", "DIN09", "IN09", "RETORNO AUTONOMO", "B +P-X56:10 | h444 > E +CP-S27 13,14 | h444 > C 184 RD", "El +24 V hilo 184 llega a CP-S27:14 desde CP-S21:14.")
add("P-A4|6.1|107", "DIN10", "IN10", "INVERSOR CABINA DCHA", "E +P-K61/2 22(K2),21(K2) | h678 > C 184 RD")
add("P-A4|5.4|107", "DIN11", "IN11", "DISYUNTOR BRAZO", "E +P-Q5 14,13 | h330 > C 184 RD")
add("P-A4|6.4|107", "DIN12", "IN12", "DISYUNTOR CABINA", "E +P-Q6 14,13 | h331 > C 184 RD")
add("P-A4|7.1|107", "DIN13", "IN13", "INVERSOR CABINA IZDA", "E +P-K61/2 22(K1),21(K1) | h679 > C 184 RD")
add("P-A4|8.1|107", "DIN14", "IN14", "DISYUNTOR SUELO", "P +P-Q7:11 | h657", "Contacto auxiliar del disyuntor P-Q7 (11-14, +24 V hilo 184 en la 14), folio 53.")
add("P-A4|7.4|107", "DIN15", "IN15", "ESTADO PROTECCIONES 24VDC", "P +P-Q30.0:Alarm | h574", "Contacto de alarma de las protecciones de 24 V del pupitre P-Q30.0 (folio 57).")
add("P-A4|8.4|107", "DIN16", "IN16", "RETENEDOR PORTON", "B +P-X92:28 | h656 > F +C-GER7:2 | h656", "Contacto del retenedor del portón C-GER7 (folio 52).")

# ---------- P-A5 entradas del pupitre (folios 108-109) ----------
SP = "Sensor alimentado desde el pupitre: pin 1 + BN hilo 184 (P-X92:1), pin 3 − BU hilo 129 (P-X92:2)."
for b, c, d, x, h, s, w, wt, wc in [("1.1","DIN01","CONTACTO AVION DCHA","6","344","+C-B51:2","CP-W171","SAC-5P-10,0-115/M12FS","WH"),
                                    ("2.1","DIN02","SENSOR FRENO CABINA","7","343","+C-B24:4","CP-W29","SAC-5P-10,0-115/M12FR","BK"),
                                    ("2.4","DIN04","ULTRASONIDOS PROXIMIDAD","8","224","+C-B6:4","CP-W19","SAC-5P-10,0-115/M12FR","BK"),
                                    ("3.1","DIN05","FOTOCELULA PROXIMIDAD AVION","5","342","+C-B3:4","CP-W13","SAC-5P-10,0-115/M12FR","BK"),
                                    ("3.4","DIN07","SENSOR ALA PBB A-380","26","215","+C-B26:2","CP-W260","SAC-5P-10,0-115/M12FR","BK"),
                                    ("4.4","DIN08","SENSOR CAPOTA RETRAIDA","3","86","+C-B17:2","CP-W43","SAC-5P-M12FS","WH")]:
    nt = SP + (" En la 507 P-X92:3 es esta señal (hilo 86), no un +24 V." if x == "3" else "")
    add(f"P-A5|{b}|108", c, "IN"+c[-2:], d, f"B +P-X92:{x} | h{h} > F {s} | m={w}/{wt}/{wc}", nt)
add("P-A5|1.4|108", "DIN03", "IN03", "ERROR SUELO", "F +P-R6:3 | h195", "Salida de error del control del suelo P-R6 (folio 53).")
add("P-A5|4.1|108", "DIN06", "IN06", "LIMITE SUELO F.C. PBB A-380",
    "B +P-X92:27 | h340 > E +C-S51 21,22 | m=CP-W211/H07RN-F_2x1,5/BU > B +P-X92:1 | m=CP-W211/H07RN-F_2x1,5/BN > C 184 RD")
CON = "Sensor inductivo del brazo autonivelador por el conector de cabina C-CON10 (manguera P-W10 H07RN-F 12x1,5); alimentación por CP-W10: C-CON10:1 hilo 184 (+24 V) y C-CON10:9 hilo 129 (0 V)."
for b, c, d, x, h, cn, s, w in [("5.1","DIN09","BRAZO CONTACTO","9","346","2","+C-B7","CC-W40"),
                                ("6.1","DIN10","BRAZO ARRIBA SEÑAL 2","10","347","4","+C-B8","CC-W41"),
                                ("5.4","DIN11","BRAZO ARRIBA SEÑAL 1","11","348","3","+C-B9","CC-W42"),
                                ("6.4","DIN12","BRAZO ABAJO SEÑAL 2","12","349","6","+C-B10","CC-W43"),
                                ("7.1","DIN13","BRAZO ABAJO SEÑAL 1","13","350","5","+C-B11","CC-W44"),
                                ("8.1","DIN14","BRAZO NEUTRAL SEÑAL 1","14","351","7","+C-B12","CC-W45"),
                                ("7.4","DIN15","BRAZO NEUTRAL SEÑAL 2","15","352","8","+C-B13","CC-W46")]:
    add(f"P-A5|{b}|109", c, "IN"+c[-2:], d, f"B +P-X92:{x} | h{h} > B +C-CON10:{cn} | m=P-W10/H07RN-F_12x1,5/{cn} > F {s}:4 | m={w}/SAC-5P-M12FR/BK", CON)
res("P-A5|8.4|109", "DIN16", "IN16")

# ---------- P-A6 entradas del pupitre (folios 110-111) ----------
for b, c, d, s, x, h in [("1.1","DIN01","PULSADOR ABANDONO OPERADOR","+CP-S40","5","658"),("2.1","DIN02","PULSADOR PRESENCIA DESCONEXION","+CP-S41","6","659"),
                         ("1.4","DIN03","PULSADOR PRESENCIA CONEXION","+CP-S42","7","660"),("2.4","DIN04","PULSADOR LUMINOSO OK HANDLING","+CP-S43","8","661")]:
    add(f"P-A6|{b}|110", c, "IN"+c[-2:], d, f"B +P-X59:{x} | h{h} > E {s} 14,13 | h{h} > B +P-X59:4 | h184 > C 184 RD")
res("P-A6|3.1|110", "DIN05", "IN05")
OUT = "Sensor de outrigger alimentado desde el armario E por H-X51:1 (+24 V hilo 218, BN) y H-X51:2 (0 V hilo 129, BU). En la 507 los hilos 205/206/208 son señales, no el 0 V."
for b, c, d, a, x, h, s, w in [("4.1","DIN06","OUTRIGGER IZQUIERDO ARRIBA","7","25","205","+H-B5","HH-W42"),
                               ("3.4","DIN07","OUTRIGGER DERECHO ABAJO","8","26","206","+H-B6","HH-W43")]:
    add(f"P-A6|{b}|110", c, "IN"+c[-2:], d,
        f"B +P-X92.1:{a} | h{h} > B +E1-X68.1:{a} | m={EW6}/{a} > B +E-X55:{x} | h{h} > B +H-X51:{x} | m=EH-W1/H07RN-F_27x1,5/{x} > F {s}:4 | m={w}/SAC-5P-5,0-115/M12FR/BK", OUT)
add("P-A6|4.4|110", "DIN08", "IN08", "PRESOSTATO CONTROL BAJADA OUTRIGGERS",
    f"B +P-X92.1:9 | h208 > B +E1-X68.1:9 | m={EW6}/9 > B +E-X55:20 | h208 > B +H-X51:20 | m=EH-W1/H07RN-F_27x1,5/20 > E +H-B9 1,3 | m=HH-W44/H07RN-F_3x1,5/BU > B +H-X51:1 | m=HH-W44/H07RN-F_3x1,5/BN > C 218 RD", OUT)
add("P-A6|5.1|111", "DIN09", "IN09", "CREPUSCULAR", "B +P-X51:16 | h499 > B +E-X59:16 | m=EP-W1/H07RN-F_24x1,5/16 > E +E-B2 2,4 > C 218 RD",
    "Contacto del interruptor crepuscular E-B2 (folio 39) con +24 V hilo 218 desde E-X54:1.")
for b, c, d, x, h, k in [("6.1","DIN10","SENSOR 1 AKS MOTOR 3m","17","222","3"),("5.4","DIN11","SENSOR 1 AKS MOTOR 1,5m","18","223","4"),
                         ("6.4","DIN12","SENSOR 2 AKS MOTOR 3m","19","225","6"),("7.1","DIN13","SENSOR 2 AKS MOTOR 1,5m","20","227","7"),
                         ("8.1","DIN14","SENSOR 3 AKS MOTOR 3m","21","242","8"),("7.4","DIN15","SENSOR 3 AKS MOTOR 1,5m","22","299","9")]:
    add(f"P-A6|{b}|111", c, "IN"+c[-2:], d, f"B +P-X51:{x} | h{h} > B +E-X59:{x} | m=EP-W1/H07RN-F_24x1,5/{x} > B +E-X97:{k} | h{h}",
        "Sensor antichoque AKS; continúa por E-X97 en el folio 69 (507).")
add("P-A6|8.4|111", "DIN16", "IN16", "BYPASS AKS", "B +P-X51:23 | h211 > B +E-X59:23 | m=EP-W1/H07RN-F_24x1,5/23 > E +E-S7 14,13 | h211 > C 218 RD",
    "Llave de bypass AKS E-S7 en el armario; +24 V hilo 218 desde E-X51:1.")

# ---------- P-A7 analógica del pupitre (folio 112) ----------
add("P-A7|1.2|112", "AI01", "AIN01", "INCLINOMETRO SUELO BASCULANTE (analógica 4-20 mA)",
    "B +P-X62:2 | m=PP-W1/SUPER-PAAR-TRONIC-C-PUR_2x0,75/WH > F +C-R3.1:YE | m=CP-W50/QG40N-KDXYh-015-AI-PT5/YE",
    "Inclinómetro C-R3.1: L+ BN hilo 184 (P-X62:1 ← P-X92.1:22), señal 4-20 mA YE hilo 677 (P-X62:2 → +I1 1.2), L− GN hilo 129 (P-X62:3 → GND 1.3 y P-X92.1:24). Pantalla P-X62:4 → P-X67:24.")
res("P-A7|2.2|112", "AI02", "AIN02")

if __name__ == "__main__":
    out = os.path.join(os.path.dirname(__file__), "..", "cableado507.js")
    js = ("/* Cableado PBB 507 (A380) trazado borna a borna del esquema T87911031230ES rev. C. Generado por tools/build_507.py.\n"
          "   Claves MOD|borna|folio (folio del plano 507). Se usa en lugar de CABLEADO cuando la OT es de la 507. */\n"
          "window.CABLEADO507=" + json.dumps(E, ensure_ascii=False, separators=(",", ":")) + ";\n")
    open(out, "w").write(js); print(len(E), "entradas")
