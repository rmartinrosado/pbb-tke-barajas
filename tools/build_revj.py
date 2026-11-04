#!/usr/bin/env python3
"""Genera cableado-revj.js: correcciones y altas sobre window.CABLEADO tras cotejar
punto por punto los folios 52-88 (y 96) del ESQUEMA GENERAL T87911031210ES rev. J."""
import json, sys

def V(spec):
    """'h250' | 'h205/WH' | 'm=EP-W4/27x1,5/2' -> dict de conductor"""
    if spec.startswith("m="):
        m, t, d = (spec[2:].split("/") + ["", ""])[:3]
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

E = {}   # clave -> entrada completa (alta o sustitución)
DEL = [] # claves a quitar
NOTE = {}

def add(key, c, k, d, chain, note=None):
    m, b, f = key.split("|")
    f = int(f)
    n = []
    if note:
        n.append({"k": "?", "f": f, "x": note, "v": []})
    n += [el(x.strip(), f) for x in chain.split(" > ")]
    E[key] = {"m": m, "b": b, "f": f, "c": c, "k": k, "d": d, "n": n}

# ---------- E-A0 (folio 52) ----------
add("E-A0|1.1|52", "DIN01", "IN01", "ESTADO E-K0 CONTACTOR SEGURIDAD (LINEA DE SEGURIDADES)",
    "E +E-K0 22,21 | h250 > C 189 RD")
add("E-A0|4.1|52", "DIN06", "IN06", "PROTECTOR SOBRETENSIONES",
    "E +E-F21 12,11 | h256 > E +E-F20 12,11 > E +E-F19 12,11 > C 189 RD")
add("E-A0|3.4|52", "DIN07", "IN07", "DETECTOR 1 GIRO ROTONDA",
    "B +E-X51:20 | h264 > B +IT-X51:20 | m=EIT-W1/H07RN-F_24x1,5/20 > B +CO3-X51:5 | m=ITCO3-W1/H07RN-F_7x1,5/5 > E +CO-B1 BN,BU | m=CO3-W2/FABRICANTE/BN > B +CO3-X51:1 | m=CO3-W2/FABRICANTE/BU > C 189 RD")
add("E-A0|4.4|52", "DIN08", "IN08", "DETECTOR 2 GIRO ROTONDA",
    "B +E-X51:21 | h265 > B +IT-X51:21 | m=EIT-W1/H07RN-F_24x1,5/21 > B +CO3-X51:6 | m=ITCO3-W1/H07RN-F_7x1,5/6 > E +CO-B2 BN,BU | m=CO3-W3/FABRICANTE/BN > B +CO3-X51:1 | m=CO3-W3/FABRICANTE/BU > C 189 RD")

# ---------- E-A1 (folios 54-57) ----------
for b, c, k, d, u, li, h in [("1.1","DON01","OUT01","VARIADOR U1 ADELANTE","U1","LI1","191"),
                             ("2.1","DON02","OUT02","VARIADOR U1 ATRAS","U1","LI2","192"),
                             ("1.2","DON03","OUT03","VARIADOR U2 ADELANTE","U2","LI1","197"),
                             ("2.2","DON04","OUT04","VARIADOR U2 ATRAS","U2","LI2","198"),
                             ("1.3","DON05","OUT05","VARIADOR U1 VELOCIDAD 1","U1","LI3","194"),
                             ("2.3","DON06","OUT06","VARIADOR U1 VELOCIDAD 2","U1","LI4","195"),
                             ("1.4","DON07","OUT07","VARIADOR U2 VELOCIDAD 1","U2","LI3","199"),
                             ("2.4","DON08","OUT08","VARIADOR U2 VELOCIDAD 2","U2","LI4","200")]:
    add(f"E-A1|{b}|54", c, k, d, f"F +E-{u}:{li} | h{h}")
DEL += ["E-A1|8.1|57", "E-A1|8.2|57"]  # rev. J: DON26 y DON28 son reserva (el retorno autónomo pasa a E-A7 DOS04)
add("E-A1|7.3|57", "DON29", "OUT29", "AUTORIZACION ROTONDA",
    "B +E-X70:8 | h679 > B +IT-X50:8 | m=EIT-W10/20x0,75/PK > E +R-S2 X1,X2 | m=ITR-W5/H07RN-F_5x1,5/BN > B +IT-X50:9 | m=ITR-W5/H07RN-F_5x1,5/BU > B +E-X70:9 | m=EIT-W10/20x0,75/BU > C 205 WH")

# ---------- E-A2 (folios 58-59) ----------
add("E-A2|2.1|58", "DIN02", "IN02", "VARIADOR U1 FALLO", "F +E-U1:X1B.19 | h190")
add("E-A2|1.4|58", "DIN03", "IN03", "VARIADOR U2 FALLO", "F +E-U2:X1B.19 | h196")
for b, c, k, d, xb, it, s, w, h in [("2.4","DIN04","IN04","LIMITE INFERIOR INCLINACION","+E-X51:22","+IT-X51:22","+IT-B10","IT-W15","268"),
                                    ("3.1","DIN05","IN05","LIMITE SUP INCLINACION","+E-X51:23","+IT-X51:23","+IT-B11","IT-W15.1","248")]:
    add(f"E-A2|{b}|58", c, k, d,
        f"B {xb} | h{h} > B {it} | m=EIT-W1/H07RN-F_24x1,5/{xb.split(':')[1]} > E {s} 3,1 | m={w}/FABRICANTE/BK > B +IT-X51:1 | m={w}/FABRICANTE/189_BN > C 189 RD")
for b, c, k, d, xb, it, s, w, h in [("4.1","DIN06","IN06","DETECTOR 1 EXTEN/RETRACCION","+E-X54:9","+ET-X51:9","+ET-B6","ET1-W5","271"),
                                    ("3.4","DIN07","IN07","DETECTOR 2 EXTEN/RETRACCION","+E-X54:10","+ET-X51:10","+ET-B7","ET1-W6","272")]:
    add(f"E-A2|{b}|58", c, k, d,
        f"B {xb} | h{h} > B {it} | m=EET-W1/H07RN-F_12x1,5/{xb.split(':')[1]} > E {s} 3,1 | m={w}/FABRICANTE/BK > B +ET-X51:1 | m={w}/FABRICANTE/189_BN > C 189 RD")
add("E-A2|8.1|59", "DIN14", "IN14", "VARIADOR U1 FRENO PERDIDO", "F +E-U1:R2A | h733")
add("E-A2|7.4|59", "DIN15", "IN15", "PULSADOR ILUMINACION SS",
    "B +E-X68:7 | h610 > E +SS-S1 N,L1 > B +E-X51:1 | h189 > C 189 RD")
add("E-A2|8.4|59", "DIN16", "IN16", "PULSADOR ILUMINACION",
    "B +E-X51:17 | h269 > B +IT-X51:17 | m=EIT-W1/H07RN-F_24x1,5/17 > E +IT-S1 N,L1 | m=IT-W10/0_HALOGENOS_5x1,5/BN > B +IT-X51:1 | m=IT-W10/0_HALOGENOS_5x1,5/BU > C 189 RD")
add("E-A2|7.1|59", "DIN13", "IN13", "FC CAPOTA DERECHA",
    "B +E-X57:21 | h274 > B +C-X51:21 | m=EC-W1/H07RN-F_24x1,5/21 > E +C-S16 12,11 | m=C-W16/H07RN-F_2x1,5/BK > B +C-X51:1 | m=C-W16/H07RN-F_2x1,5/BU > C 189 RD")

# ---------- E-A3 (folios 60-61) ----------
add("E-A3|1.4|60", "DIN03", "IN03", "SETAS TRASLACION",
    "B +E-X55:11 | h278 > B +H-X51:11 | m=EH-W1/H07RN-F_24x1,5/11 > J E +H-S3 14,13 | m=H-W3/H07RN-F_5x1,5/BN ;; E +H-S4 14,13 | m=H-W4/H07RN-F_5x1,5/BN > B +H-X51:28 | m=H-W3/H07RN-F_5x1,5/BU > C 189 RD")
add("E-A3|2.4|60", "DIN04", "IN04", "VARIADOR U2 FRENO PERDIDO", "F +E-U2:R2A | h734")
add("E-A3|3.1|60", "DIN05", "IN05", "ESTADO E-K1", "E +E-K1 22,21 | h737 > C 189 RD")
add("E-A3|4.1|60", "DIN06", "IN06", "ESTADO E-K3", "E +E-K3 22,21 | h738 > C 189 RD")
add("E-A3|3.4|60", "DIN07", "IN07", "ESTADO E-K24", "E +E-K24 R2,R1 | h739 > C 189 RD")
for b, c, k, d, xb, s, ps, w, wd in [("6.1","DIN10","IN10","FRENO MANUAL MOTOR IZDO","8","+T-S6","GR,BK","H-W19","6"),
                                     ("5.4","DIN11","IN11","FRENO ELEC. MOTOR DCHO","9","+T-S7","BU,BK","H-W20","4"),
                                     ("6.4","DIN12","IN12","FRENO MANUAL MOTOR DCHO","10","+T-S8","GR,BK","H-W20","6")]:
    hh = {"8":"277","9":"279","10":"280"}[xb]; wi = {"8":"5","9":"3","10":"5"}[xb]
    add(f"E-A3|{b}|61", c, k, d,
        f"B +E-X55:{xb} | h{hh} > B +H-X51:{xb} | m=EH-W1/H07RN-F_24x1,5/{xb} > E {s} {ps} | m={w}/H07RN-F_7x1,5/{wi} > B +H-X51:26 | m={w}/H07RN-F_7x1,5/{wd}_189 > C 189 RD")
for b, c, k, d, xb, s, w, h in [("7.1","DIN13","IN13","LIMITE GIRO TRASLACION IZDA","18","+H-B3","H-W16","281"),
                                ("8.1","DIN14","IN14","LIMITE GIRO TRASLACION DCHA","19","+H-B4","H-W17","282"),
                                ("7.4","DIN15","IN15","CONTAJE TRASLACION IZDA","16","+H-B1","H-W14","283"),
                                ("8.4","DIN16","IN16","CONTAJE TRASLACION DCHA","17","+H-B2","H-W15","284")]:
    add(f"E-A3|{b}|61", c, k, d,
        f"B +E-X55:{xb} | h{h} > B +H-X51:{xb} | m=EH-W1/H07RN-F_24x1,5/{xb} > E {s} 2,1 | m={w}/SAC-5P-M12FR/BK > B +H-X51:26 | m={w}/SAC-5P-M12FR/BN_189 > C 189 RD")

# ---------- E-A4 analógicas (folio 62) ----------
DEL += ["E-A4|1.2|62", "E-A4|2.2|62", "E-A4|1.3|62", "E-A4|2.3|62", "E-A4|1.4|62", "E-A4|2.4|62"]
add("E-A4|1.1|62", "AI01", "AIN01", "MEDIDOR ALTURA (analógica)",
    "B +E-X62:3 | h341 > B +P-X62:3 | m=EP-W8/3x0,75/BK > F +C-B14:BK | m=P-W20/FABRICANTE/BK",
    "Entrada analógica: el sensor C-B14 se alimenta por E-X62:1 (+24 V, 189) BN y E-X62:2 (0 V, 205) BU. Retorno −I1 en la borna 2.1.")
add("E-A4|1.2|62", "AI02", "AIN02", "MEDIDA EXTENSION (analógica)",
    "B +E-X62:4 | h312 > F +ET-B9:BK | m=E-W13/3x0,75/BK",
    "Entrada analógica: el láser de extensión ET-B9 se alimenta por E-X62:1 (+24 V) BN y E-X62:2 (0 V) BU. Retorno −I2 en la borna 2.2.")
add("E-A4|1.3|62", "AI03", "AIN03", "MEDIDOR CABINA (analógica)",
    "B +E-R10:7 | h315 > F +E-R10:1-2-3 | m=E-W9/3x0,75/BK-BN-GY",
    "Entrada analógica: convertidor E-R10 WAS5 PRO RTD (alimentado por 10/11 desde E-X68:1 y E-X68:2) leyendo el potenciómetro de giro de cabina C-R10 por E-X65. Retorno −I3 (E-R10:9) en la borna 2.3.")
add("E-A4|1.4|62", "AI04", "AIN04", "POTENCIOMETRO GIRO ROTONDA (analógica)",
    "B +E-X62:5 | h316 > B +IT-X62:1 | m=EIT-W4/6x0,75/1 > F +R-R1:x2 | m=IT-W16/3x0,75/BK",
    "Entrada analógica 4-20 mA (todas las posiciones menos 504/508). Retorno −I4 en la borna 2.4.")

# ---------- E-A5 alimentación módulo de seguridades (folio 63) ----------
DEL += ["E-A5|2.1|63", "E-A5|2.2|63", "E-A5|2.3|63", "E-A5|2.4|63"]
add("E-A5|1.1|63", "US", "US", "ALIMENTACION MODULO SEGURIDADES (US 1.1 · UM 1.2 · US 2.1)",
    "B +E-X68:6 | h613 > C 613 RD",
    "Módulo de potencia IB IL 24 PWR IN: US/UM con +24 V hilo 613 (E-Q30.4) y GND 1.3 con hilo 205 (E-X68:2).")

# ---------- E-A7 (folio 66) ----------
add("E-A7|4.1|66", "DOS04", "OUT1_Ch2", "RETORNO AUTONOMO",
    "E +E-K26 A1,A2 | h735 > M GND | h736/WH")

# ---------- E-A8 (folio 68) ----------
add("E-A8|1.1|68", "DIS01", "IN01S", "SENSOR PORTON ENROLLABLE",
    "B +E-X68.1:2 | h377 > B +P-X92.1:2 | m=EP-W4/H07RN-F_27x1,5/2 > E +C-S9 4,1 | m=P-W21/SAC-5P-10,0-PUR/BK > B +P-X92.1:1 | m=P-W21/SAC-5P-10,0-PUR/BN > B +E-X68.1:1 | m=EP-W4/H07RN-F_27x1,5/1 > C 613 RD")

# ---------- E-A10 (folio 70) ----------
add("E-A10|4.1|70", "DIS04", "IN04S", "INDUCTIVO PUERTA SERVICIO",
    "B +E-X68:8 | h674 > E +SS-B15 4,1 | m=ESS-W20/SAC-5P-10,0/BK > C 613 RD")

# ---------- P-A1 (folios 73-74) ----------
add("P-A1|1.1|73", "DON01", "OUT01", "SEÑAL ALARMA",
    "B +P-X53:10 | h392 > E +CP-H2 +,- | h392 > B +P-X53:2 | h389/WH > B +P-X52:15 | h389/WH > C 205 WH")
add("P-A1|1.4|73", "DON03", "OUT03", "BUZZER",
    "E +P-H9 +,- | h395 > C 205 WH")
add("P-A1|2.1|73", "DON02", "OUT02", "SEÑAL ESTADO",
    "B +P-X53:3 | h393 > E +CP-H1 +,- | h393 > B +P-X53:2 | h389/WH > B +P-X52:15 | h389/WH > C 205 WH")
add("P-A1|4.4|74", "DON08", "OUT08", "SIRENA AUTONIVELACION",
    "E +C-H4 +,- | m=P-W3/H07RN-F_3x1,5/BN > C 205 WH")

# ---------- P-A2 (folio 79 → 96) ----------
add("P-A2|5.1|79", "DON09", "OUT09", "SEÑAL LUMINOSA EN ROTONDA ROJA",
    "B +P-X92.1:23 | h715 > B +E-X68.1:23 | m=EP-W4/H07RN-F_27x1,5/23 > B +E-X70:15 | h715 > B +IT-X50:15 | m=EIT-W10/20x0,75/WHGN > B +R-CON.M12:2 | m=ITR-W200/SAC-5P/WH > E +R-H1 2,3 | m=RR-W200/FABRICANTE/WH > C 205 WH",
    "La salida va al TRIGGER 1 (2/WH) del semáforo R-H1 SB-RGB (folio 96); el 3/BU es su 0 V.")
add("P-A2|6.1|79", "DON10", "OUT10", "SEÑAL LUMINOSA EN ROTONDA VERDE",
    "B +P-X92.1:25 | h716 > B +E-X68.1:25 | m=EP-W4/H07RN-F_27x1,5/25 > B +E-X70:18 | h716 > B +IT-X50:18 | m=EIT-W10/20x0,75/YEBN > B +R-CON.M12:5 | m=ITR-W200/SAC-5P/GY > E +R-H1 5,3 | m=RR-W200/FABRICANTE/GY > C 205 WH",
    "La salida va al TRIGGER 2 (5/GY) del semáforo R-H1 SB-RGB (folio 96); el 3/BU es su 0 V.")

# ---------- P-A3 (folios 81-82) ----------
add("P-A3|1.1|81", "DIN01", "IN01", "SETA PUPITRE",
    "B +P-X53:5 | h340 > E +CP-S5 14,13 | h312 > B +P-X53:1 | h309 > C 332 RD")
add("P-A3|2.1|81", "DIN02", "IN02", "HOMBRE MUERTO",
    "B +P-X54:2 | h342 > E +CP-S0 94,93 > B +P-X54:1 | h336 > C 336 RD")
add("P-A3|7.1|82", "DIN13", "IN13", "PBB SUBIR",
    "B +P-X57:4 | h352 > E +CP-S11 14,13 > C 309 RD")

# ---------- P-A4 (folio 84) ----------
add("P-A4|6.1|84", "DIN10", "IN10", "INVERSOR CABINA DCHA",
    "E +P-K61/2 22(K2),21(K2) | h636 > C 332 RD")
add("P-A4|7.1|84", "DIN13", "IN13", "INVERSOR CABINA IZDA",
    "E +P-K61/2 22(K1),21(K1) | h637 > C 332 RD")

# ---------- P-A5 (folios 85-86) ----------
add("P-A5|1.1|85", "DIN01", "IN01", "CONTACTO AVION DERECHA",
    "B +P-X92:12 | h320 > E +C-B51 2,1 | m=P-W17/SAC-5P-10,0-115/WH > B +P-X92:8 | m=P-W17/SAC-5P-10,0-115/BN > C 332 RD")
add("P-A5|1.4|85", "DIN03", "IN03", "SUELO SUBE DERECHA",
    "B +C4-X64:3 | m=P-W24/H07RN-F_5x1,5/375_BK > E +C-B22 GN,RD | h375 > B +C4-X64:1 | m=P-W24/H07RN-F_5x1,5/336_BN > C 336 RD",
    "Contacto -R+ (RD/GN) del inclinómetro de suelo C-B22.")
add("P-A5|4.1|85", "DIN06", "IN06", "ESTADO E-K0.1 CONTACTOR SEGURIDAD",
    "B +P-X92.1:5 | h741 > B +E-X68.1:5 | m=EP-W4/H07RN-F_27x1,5/5 > E +E-K0.1 22,21 | h741 > B +E-X68.1:7 | h332 > B +P-X92.1:7 | m=EP-W4/H07RN-F_27x1,5/7 > C 332 RD")
add("P-A5|3.4|85", "DIN07", "IN07", "ESTADO E-K26",
    "B +P-X92.1:6 | h742 > B +E-X68.1:6 | m=EP-W4/H07RN-F_27x1,5/6 > E +E-K26 52,51 | h742 > B +E-X68.1:7 | h332 > B +P-X92.1:7 | m=EP-W4/H07RN-F_27x1,5/7 > C 332 RD")
add("P-A5|4.4|85", "DIN08", "IN08", "CONTACTO AVION IZQUIERDA",
    "B +P-X92:7 | h740 > E +C-B52 2,1 | m=P-W18/SAC-5P-10,0-115/WH > B +P-X92:8 | m=P-W18/SAC-5P-10,0-115/BN > C 332 RD")
for b, c, k, d, s, w, con, h in [("5.1","DIN09","IN09","BRAZO CONTACTO","+C-B7","C-W40","2","379"),
                                 ("6.1","DIN10","IN10","BRAZO ARRIBA SEÑAL 2","+C-B8","C-W41","4","380"),
                                 ("5.4","DIN11","IN11","BRAZO ARRIBA SEÑAL 1","+C-B9","C-W42","3","381"),
                                 ("6.4","DIN12","IN12","BRAZO ABAJO SEÑAL 2","+C-B10","C-W43","6","382"),
                                 ("7.1","DIN13","IN13","BRAZO ABAJO SEÑAL 1","+C-B11","C-W44","5","383"),
                                 ("8.1","DIN14","IN14","BRAZO NEUTRAL SEÑAL 1","+C-B12","C-W45","7","384"),
                                 ("7.4","DIN15","IN15","BRAZO NEUTRAL SEÑAL 2","+C-B13","C-W46","8","385")]:
    add(f"P-A5|{b}|86", c, k, d,
        f"B +C-CON10:{con} | m=P-W10/H07RN-F_12x1,5/{con}_{h} > E {s} 4,1 | m={w}/SAC-5P-M12FR/BK > B +C-CON10:1 | m={w}/SAC-5P-M12FR/BN_332 > B +P-X92:8 | m=P-W10/H07RN-F_12x1,5/1 > C 332 RD")

# ---------- P-A6 (folios 87-88) ----------
for b, c, k, d, xb, s, w, h in [("1.1","DIN01","IN01","LIMITE CABINA IZDA","5","+C-B2","P-W9","366"),
                                ("2.1","DIN02","IN02","LIMITE CABINA DCHA","6","+C-B1","P-W8","368")]:
    add(f"P-A6|{b}|87", c, k, d,
        f"B +P-X92:{xb} | h{h} > E {s} BN,BU | m={w}/3x1,5/BK > B +P-X92:4 | m={w}/3x1,5/BK > C 332 RD",
        "Detector de 2 hilos (BN/BU).")
for b, c, k, d, s, ws, h in [("1.4","DIN03","IN03","FRENO TUNEL B","+IT-S3(TUNEL)","-WS3.2","639"),
                             ("2.4","DIN04","IN04","FRENO CABINA IZDA","+IT-S3(CABIZ)","-WS3","3381"),
                             ("3.1","DIN05","IN05","FRENO CABINA DCHA","+IT-S3(CABDE)","-WS3.1","3382")]:
    add(f"P-A6|{b}|87", c, k, d,
        f"B -CLEMA:2 | h{h} > E {s} 12,11 | m={ws}//2 > B -CLEMA:1 | m={ws}//1 > C 336 RD",
        "PBB con 3 túneles.")
add("P-A6|4.1|87", "DIN06", "IN06", "F.C. LIMITE SUELO DCHA",
    "B +P-X92:10 | h369 > E +C-S1 22,21 | m=P-W12/H07RN-F_3x1,5/BN > B +P-X92:4 | m=P-W12/H07RN-F_3x1,5/BU > C 332 RD")
add("P-A6|3.4|87", "DIN07", "IN07", "F.C. LIMITE SUELO IZDA",
    "B +P-X92:11 | h370 > E +C-S2 22,21 | m=P-W13/H07RN-F_3x1,5/BN > B +P-X92:4 | m=P-W13/H07RN-F_3x1,5/BU > C 332 RD")
add("P-A6|4.4|87", "DIN08", "IN08", "BYPASS AKS (solo stand 504/508)",
    "B +P-X52:11 | h743 > B +E-X60:11 | m=EP-W2/H07RN-F_12x2,5/11 > E +E-S7 14,13 | h743 > B +E-X68.1:4 | h332 > B +P-X92.1:4 | m=EP-W4/H07RN-F_27x1,5/4 > C 332 RD",
    "Solo stand 504/508.")
add("P-A6|5.1|88", "DIN09", "IN09", 'PULSADOR "Abandono operador"',
    "B +P-X59:8 | h726 > E +CP-S40 14,13 > B +P-X59:7 | h332 > C 332 RD")
LASER = ("Modificación de campo: en la rev. J esta borna figura como RESERVA. Cableado según el documento "
         "«Laser_detector_de_ala» (pág. 1 conexionado, pág. 2 folio 88 anotado). Seguridad positiva: PBB en servicio "
         "y sin ala → LED encendido; al detectar ala se apaga. En la 507 estas bornas son AKS.")
add("P-A6|7.1|88", "DIN13", "IN13", "LASER DETECTOR DE ALA · VELOCIDAD LENTA (Out low speed)",
    "F +LASER-ALA:DIG.OUT 3 > E +LASER-ALA OUT3,COM > P +LASER-ALA:POWER V+", LASER)
add("P-A6|8.1|88", "DIN14", "IN14", "LASER DETECTOR DE ALA · PARO (Out stop)",
    "F +LASER-ALA:DIG.OUT 1 > E +LASER-ALA OUT1,COM > P +LASER-ALA:POWER V+", LASER)


# ======================= v310: interconexiones en folios de continuación =======================
W = "m=ECBTH-W/25x"
def ext(key, c, k, d, xb, h, cb, nom):
    add(key, c, k, d,
        f"B +E-X61:{xb} | h{h} > B +CBTH-X61:{xb} | {W}/{xb} > E +CBTH:{nom} {xb},10 > B +CBTH-X61:10 | {W}/10 > B +E-X61:10 | h189 > B +E-X55:1 | h189 > C 189 RD",
        f"Contacto libre de potencial del sistema externo cableado en el CBTH entre CBTH-X61:10 (24 V común PBB, hilo 189, viene de E-X55:1) y CBTH-X61:{xb} (folio 11). Manguera ECBTH-W 25x, conductor {xb}.")
ext("E-A2|4.4|58", "DIN08", "IN08", "BLOQUEO PBB MAQUINA A/A", "11", "23", "11", "BLOQUEO-A/A")
ext("E-A2|6.1|59", "DIN10", "IN10", "BLOQUEO PBB CONVER. SERVICIO", "14", "20", "14", "BLOQUEO-CONVERTIDOR")
ext("E-A2|5.4|59", "DIN11", "IN11", "BLOQUEO PBB 90% CONECTOR", "15", "18", "15", "BLOQUEO-90%")
ext("E-A3|1.1|60", "DIN01", "IN01", "BLOQUEO PBB SETA AO", "16", "19", "16", "SETA-AO")
ext("E-A3|2.1|60", "DIN02", "IN02", "BYPASS AO (DESBLOQUEO PBB AO)", "13", "21", "13", "DESBLOQUEO-AO")
add("E-A2|5.1|59", "DIN09", "IN09", "BLOQUEO PBB CARRO A/A",
    "B +E-X61:12 | h22 > E +E-S100 11,12 | m=E-WCARRO/H07RN-F_5x1,5/22_BN > B +E-X61:8 | m=E-WCARRO/H07RN-F_5x1,5/258_BK > M UT2 | h258",
    "F.C. del carrito PCAIR E-S100 (folio 12), contacto NC 11-12 entre E-X61:12 y E-X61:8. El hilo 258 es el bucle de setas que sale del UT2 de E-A8 (folio 43): llega tensión pulsada con las setas rearmadas. E-X61:12 sale también al CBTH (CBTH-X61:12, ECBTH-W cond. 12).")
add("E-A8|4.1|68", "DIS04", "IN04S", "SETAS EMERGENCIA",
    "B +E-X55:14 | h624 > B +H-X51:14 | m=EH-W1/H07RN-F_24x1,5/14 > E +H-S3 22,21 | m=H-W3/H07RN-F_5x1,5/BK > B +H-X51:29 | m=H-W3/H07RN-F_5x1,5/246_GY > E +H-S4 22,21 | m=H-W4/H07RN-F_5x1,5/BK > B +H-X51:20 | m=H-W4/H07RN-F_5x1,5/356_GY > B +E-X55:20 | m=EH-W1/H07RN-F_24x1,5/20 > B +E-X59:12 | h356 > B +P-X51:12 | m=EP-W1/H07RN-F_24x1,5/12 > B +P-X53:7 | h356 > E +CP-S5 22,21 | h356 > B +P-X53:8 | h258 > B +P-X51:13 | h258 > B +E-X59:13 | m=EP-W1/H07RN-F_24x1,5/13 > B +E-X61:8 | h258 > B +CBTH-X61:8 | m=ECBTH-W/25x/8 > E +CBTH:SETA-AO 8,9 > B +CBTH-X61:9 | m=ECBTH-W/25x/9 > B +E-X61:9 | h181 > M UT2 | h181",
    "Bucle de paradas de emergencia (folio 43): setas de elevación H-S3/H-S4 (21-22), seta del pupitre CP-S5 (21-22) y seta del AO en el CBTH (CBTH-X61:8-9), en serie desde el UT2 de E-A8 (hilo 181) hasta la entrada 4.1 (hilo 624).")
add("E-A8|2.1|68", "DIS02", "IN02S", "BORDE RUEDAS",
    "E +E-U5 14,13 | h260 > M UT2 | h622",
    "Relé de bordes GELBAU E-U5 (folio 41), alimentado A1 = 189 (E-X68:1) y A2 = 205 (E-X68:2). Su contacto 13-14 cierra con el bucle de bordes sano: ver «Bucle bordes de ruedas» en Circuitos auxiliares.")
add("E-A10|8.1|70", "DIS08", "IN08S", "ZAPATA ACTIVADA",
    "B +E-X59:10 | h412 > B +P-X51:10 | m=EP-W1/H07RN-F_24x1,5/10 > E +P-U5 14,13 | h412 > B +P-X51:9 | h411 > B +E-X59:9 | m=EP-W1/H07RN-F_24x1,5/9 > M UT2 | h411",
    "Relé de zapata GELBAU P-U5 (folio 45), alimentado A1 = 330 (P-X92:3) y A2 = 205 (P-X92:2). Su contacto 13-14 cierra con la zapata C-B4 sana: ver «Bucle zapata de seguridad» en Circuitos auxiliares.")
add("E-A10|3.1|70", "DIS03", "IN03S", "BARRERA SEGURIDAD ROTONDA",
    "B +E-X70:6 | h646 > B +IT-X50:6 | m=EIT-W10/20x0,75/646_PKBN > E +R-B4 4,1 | m=ITR-W4/SAC-4P-20,0-PUR/646_BK > B +IT-X50:4 | m=ITR-W4/SAC-4P-20,0-PUR/613_BN > B +E-X70:4 | m=EIT-W10/20x0,75/613_YE > C 613 RD",
    "Cortina fotoeléctrica en cascada (folio 89): emisor R-B1 (test 645 desde E-A1 4.4) → receptor R-B2 → hilo 647 por IT-X50:22 → emisor R-B3 → receptor R-B4, cuya salida Q (pin 4) entra aquí.")
add("E-A1|4.4|55", "DON16", "OUT16", "TEST BARRERA SEGURIDAD ROTONDA",
    "B +E-X70:3 | h645 > B +IT-X50:3 | m=EIT-W10/20x0,75/645_GN > E +R-B1 4,3 | m=ITR-W1/SAC-4P-20,0-PUR/645_BK > B +IT-X50:2 | m=ITR-W1/SAC-4P-20,0-PUR/205_BU > B +E-X70:2 | m=EIT-W10/20x0,75/205_BN > C 205 WH",
    "Entrada de test T1 del emisor R-B1 (folio 89). El emisor se alimenta con 613 (E-X70:1) y 205 (E-X70:2).")
add("E-A6|7.1|65", "DOS07", "OUT3_Ch1", "SIRENA SEGURIDAD CABINA",
    "B +E-X70:22 | h664 > E +C-H41 X1:3,X1:5 | m=EC-W20/H07RN-F_7x1,5/664_1 > B +E-X70:23 | m=EC-W20/H07RN-F_7x1,5/665_2 > M GND | h665/WH")
add("E-A9|4.1|69", "DIS04", "IN04S", "SIRENA SEGURIDAD CABINA (vigilancia)",
    "B +E-X70:25 | h666 > E +C-H41 X3:7,X3:5 | m=EC-W20/H07RN-F_7x1,5/666_6 > B +E-X70:24 | m=EC-W20/H07RN-F_7x1,5/667_5 > M UT2 | h667",
    "Vigilancia de la sirena C-H41 (folio 91): IN X3:5 recibe el UT2 y la devuelve por OUT X3:7. La sirena se alimenta por X3:1 = 613 (E-X70:1, EC-W20 cond. 3) y X3:3 = 205 (E-X70:2, cond. 4).")
add("E-A7|1.1|66", "DOS01", "OUT0_Ch1", "BAJADA RAPIDA",
    "B +E-X55:6 | h275 > B +H-X51:6 | m=EH-W1/H07RN-F_24x1,5/6 > E +H-Y3 x1,x2 | m=H-W8/H07RN-F_3x1,5/BK > B +H-X52:11 | m=H-W8/H07RN-F_3x1,5/BU > B +E-X56:11 | m=EH-W2/H07RN-F_12x1,5/11 > M GND | h8/WH",
    "Electroválvula H-Y3 24 VDC 0,8 A (folio 44).")
add("E-A7|2.1|66", "DOS02", "OUT0_Ch2", "BAJADA RAPIDA IZQUIERDA/DERECHA",
    "B +E-X55:15 | h33 > B +H-X51:15 | m=EH-W1/H07RN-F_24x1,5/15 > E +H-Y4 x1,x2 | m=H-W6/H07RN-F_3x1,5/BK > B +H-X51:32 | m=H-W6/H07RN-F_3x1,5/BU > E +H-Y5 x1,x2 | m=H-W7/H07RN-F_3x1,5/BK > B +H-X52:11 | m=H-W7/H07RN-F_3x1,5/BU > B +E-X56:11 | m=EH-W2/H07RN-F_12x1,5/11 > M GND | h8/WH",
    "Electroválvulas H-Y4 y H-Y5 de 12 VDC 1,5 A en serie sobre 24 V (folio 44).")
for key, c, k, d, ws in [("E-A9|5.1|69","DIS05","IN05S","ANTIATRAPAMIENTO TUNEL INTERIOR IZQUIERDO","IT-S3''"),
                         ("E-A9|6.1|69","DIS06","IN06S","ANTIATRAPAMIENTO TUNEL INTERIOR DERECHO","IT-S3'"),
                         ("E-A9|2.1|69","DIS02","IN02S","ANTIATRAPAMIENTO TUNEL MEDIO IZQUIERDO","MT-S3''"),
                         ("E-A9|8.1|69","DIS08","IN08S","ANTIATRAPAMIENTO TUNEL MEDIO DERECHO","MT-S3'")]:
    h = {"IT-S3''":"743","IT-S3'":"744","MT-S3''":"745","MT-S3'":"746"}[ws]
    add(key, c, k, d, f"B -CLEMA:{h} | h{h} > E +{ws}(INF) 12,11 > E +{ws}(SUP) 12,11 > B -CLEMA:613 | h613 > B +E-X68:6 | h613 > C 613 RD",
        "Finales de carrera superior e inferior en serie (folio 41), alimentados con 613 desde E-X68:6. PBB con 3 túneles en los del túnel medio.")

# --- circuitos auxiliares (no son E/S del PLC, pero son las interconexiones que alimentan a varias) ---
def aux(b, f, d, chain, note, k="AUX"):
    add(f"AUX|{b}|{f}", "AUX", k, d, chain, note)
aux("Bordes ruedas", 41, "BUCLE BORDES DE RUEDAS (relé E-U5 Z1-Z2)",
    "B +E-X55:21 | h260 > B +H-X51:21 | m=EH-W1/H07RN-F_24x1,5/21 > B +T-CON10:1 | m=H-W18/H07RN-F_3x1,5/BN > E +T-B5 1,2 | m=T1-W1/FABRICANTE/BK > B +T-CON10:3 | m=T1-W1/FABRICANTE/239_BK > E +T-B6 2,1 | m=T1-W2/FABRICANTE/239_BK > B +T-CON10:2 | m=T1-W2/FABRICANTE/BK > B +H-X51:22 | m=H-W18/H07RN-F_3x1,5/BK > B +E-X55:22 | m=EH-W1/H07RN-F_24x1,5/22 > P +E-U5:Z2 | h622",
    "Bucle resistivo de los bordes de seguridad delantero T-B5 y trasero T-B6 del tren de ruedas. Lo vigila E-U5 entre Z1 (hilo 260) y Z2 (hilo 622). No es una tensión de 24 V fija: mide continuidad del bucle. Si un borde se pisa, E-U5 abre 13-14 y cae la entrada E-A8 2.1.")
aux("Zapata", 45, "BUCLE ZAPATA DE SEGURIDAD (relé P-U5 Z1-Z2)",
    "B +P-U5:Z1 | h387 > E +C-B4 1,2 | m=CP-W14/FABRICANTE/BN > P +P-U5:Z2 | m=CP-W14/FABRICANTE/BU",
    "Zapata ASO SENTIR edge con resistencia final 1K5 + 470 Ω, vigilada por P-U5 entre Z1 (387) y Z2 (388). Se mide continuidad/resistencia, no tensión. Si la zapata actúa, P-U5 abre 13-14 y cae la entrada E-A10 8.1.")
aux("Valvula subir", 44, "ELECTROVALVULA SUBIR H-Y1 (contacto E-K61 11-14)",
    "B +E-X55:4 | h301 > B +H-X51:4 | m=EH-W1/H07RN-F_24x1,5/4 > E +H-Y1 x1,x2 | m=H-W9/H07RN-F_3x1,5/BN > B +H-X51:31 | m=H-W9/H07RN-F_3x1,5/BU > C 205 WH",
    "Alimenta E-K61 11-14 desde 189 (E-X68:1) cuando el PLC activa E-A1 3.1 (E-K61). Válvula 24 VDC 0,8 A (folio 44). «Activar salida» = E-K61 cerrado.", "OUT E-K61")
aux("Valvula bajar", 44, "ELECTROVALVULA BAJAR H-Y2 (contacto E-K62 11-14)",
    "B +E-X55:5 | h302 > B +H-X51:5 | m=EH-W1/H07RN-F_24x1,5/5 > E +H-Y2 x1,x2 | m=H-W10/H07RN-F_3x1,5/BN > B +H-X51:31 | m=H-W10/H07RN-F_3x1,5/BU > C 205 WH",
    "Alimenta E-K62 11-14 desde 189 (E-X68:1) cuando el PLC activa E-A1 4.1 (E-K62). Válvula 24 VDC 0,8 A (folio 44). «Activar salida» = E-K62 cerrado.", "OUT E-K62")
for b, rel, h, nom in [("2","E-K85","29","PBB ACTIVADA"),("3","E-K86","28","PBB SERVICIO"),("4","E-K87","27","PBB MANTENIMIENTO"),("5","E-K88","26","AVERIA PBB")]:
    aux(f"CBTH-X61:{b}", 11, f"SEÑAL AL CBTH: {nom} (CBTH-X61:{b})",
        f"B +CBTH-X61:{b} | {W}/{b} > B +E-X61:{b} | h{h} > E +{rel} 11,14 | h{h} > B +E-X61:1 | h182 > B +CBTH-X61:1 | {W}/1 > P +CBTH:24V-COMUN-CBTH | h182",
        f"El CBTH entrega su 24 V común por CBTH-X61:1 (hilo 182) y la PBB lo devuelve por el contacto 11-14 de {rel} (salida E-A1, folio 56) en CBTH-X61:{b}. Manguera ECBTH-W 25x.")
aux("CBTH-X61:18", 11, "SEÑAL CARRO A/A AL CBTH (CBTH-X61:18)",
    f"B +CBTH-X61:18 | {W}/18 > B +E-X61:18 | h16 > E +E-S100 14,13 | m=E-WCARRO/H07RN-F_5x1,5/16_GY > B +E-X61:17 | m=E-WCARRO/H07RN-F_5x1,5/17_BU > B +CBTH-X61:17 | {W}/17 > P +CBTH:24V-COMUN-A/A | h17",
    "El sistema A/A da su 24 V común por CBTH-X61:17 (hilo 17); el F.C. del carrito PCAIR E-S100 (13-14) lo devuelve por CBTH-X61:18 (hilo 16). Folios 11 y 12.")


add("E-A9|1.1|69", "DIS01", "IN01S", "PULSADOR LUMINOSO OK RETIRADA PBB",
    "B +E-X68.1:8 | h680 > B +P-X92.2:8 | m=EP-W4/H07RN-F_27x1,5/8 > B +P-X92.3:3 | h332 > E +H-S11 14,13 | m=PH-W1//3 > B +P-X92.3:4 | m=PH-W1//4 > B +P-X92.2:9 | h2000 > B +E-X68.1:9 | m=EP-W4/H07RN-F_27x1,5/9 > M UT1 | h681",
    "Folio 69: el pulsador H-S11 (13-14) cierra el bucle de test UT1 (hilo 681) hacia la entrada 1.1 (hilo 680) por P-X92.2:8-9 y P-X92.3:3-4. El tramo P-X92.3:3 → P-X92.2:8 lleva el número de hilo 332: confirmar en campo que no está puenteado al +24 V del pupitre. El piloto x1-x2 del pulsador va por P-K84 (folio 88).")

# ajustes puntuales sobre entradas existentes (sin rehacerlas)
PATCH = [
    # E-A10: los selectores CP-S16 pasan por P-X92.1 (no P-X92.2) en la rev. J
    ("E-A10", ["1.1", "1.2", "2.1", "2.2", "5.1", "5.2", "6.1", "6.2", "7.1", "7.2"], "+P-X92.2", "+P-X92.1"),  # folios 70 y 92
]

out = {"E": E, "DEL": DEL, "PATCH": PATCH}
js = ("/* v309: cableado cotejado punto por punto con el ESQUEMA GENERAL T87911031210ES rev. J (folios 52-88 y 96).\n"
      " Corrige trazas de la rev. D y añade las E/S que faltaban (incl. láser detector de ala P-A6 7.1/8.1, modificación de campo).\n"
      " Se aplica sobre window.CABLEADO justo después de cableado.js. Generado por build_revj.py. */\n"
      "(function(){var C=window.CABLEADO;if(!C)return;var R=" + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n"
      "R.DEL.forEach(function(k){delete C[k]});\n"
      "Object.keys(R.E).forEach(function(k){C[k]=R.E[k]});\n"
      "R.PATCH.forEach(function(p){Object.keys(C).forEach(function(k){var e=C[k];if(e.m!==p[0]||p[1].indexOf(e.b)<0)return;"
      "e.n.forEach(function(n){if(n.t===p[2])n.t=p[3]})})});\n"
      "/* v310: retorno de los comunes por sus regleteros (folios 40, 48): los sensores de campo toman el 189 del regletero de su manguera */\n"
      "var RET={'+IT-X51':[['+E-X51','1','EIT-W1','H07RN-F 24x1,5','1']],'+CO3-X51':[['+IT-X51','1','ITCO3-W1','H07RN-F 7x1,5','1'],['+E-X51','1','EIT-W1','H07RN-F 24x1,5','1']],'+ET-X51':[['+E-X54','1','EET-W1','H07RN-F 12x1,5','1']],'+C-X51':[['+E-X57','1','EC-W1','H07RN-F 24x1,5','1']],'+H-X51':[['+H-X51','1'],['+E-X55','1','EH-W1','H07RN-F 24x1,5','1']]};\n"
      "var SRC={'189':'+E-X68:1','613':'+E-X68:6','332':'+P-X92:1'};\n"
      "Object.keys(C).forEach(function(k){var e=C[k],n=e.n;var L=n[n.length-1];if(!L||L.k!=='C')return;var w=(L.w||'').split(' ')[0];var P=n[n.length-2];\n"
      " if(w==='189'&&P&&P.k==='B'&&RET[P.t]&&(P.t!=='+H-X51'||/^(26|27|28|1)$/.test(P.p))){var add=RET[P.t].filter(function(r){return !(r[0]===P.t&&r[1]===P.p)});\n"
      "  var ins=add.map(function(r){var o={k:'B',t:r[0],p:r[1],f:e.f};if(r[2])o.v=[{m:r[2],t:r[3],d:r[4]}];return o});\n"
      "  if(ins.length&&!(n[n.length-3]&&n[n.length-3].t===ins[ins.length-1].t))n.splice.apply(n,[n.length-1,0].concat(ins))}\n"
      " var s=SRC[w];if(s){var q=s.split(':'),P2=n[n.length-2];if(!(P2&&P2.k==='B'&&P2.t===q[0]&&P2.p===q[1])&&(e.m.charAt(0)==='P'?q[0].charAt(1)==='P':q[0].charAt(1)==='E'))n.splice(n.length-1,0,{k:'B',t:q[0],p:q[1],f:e.f,v:[{h:w,c:'RD',s:'1'}]})}});\n"
      "/* entradas de seguridad cuyo enlace a la salida de test (UT) quedó sin nombre: se toma de la borna x.2 del mismo grupo */\n"
      "Object.keys(C).forEach(function(k){var e=C[k];if(!/S$/.test(e.k||''))return;var L=e.n[e.n.length-1];"
      "if(!L||L.k!=='M'||L.l&&L.l!=='undefined')return;var g=e.b.split('.')[0],u=C[e.m+'|'+g+'.2|'+e.f];L.l=u&&/^UT/.test(u.k)?u.k:'UT'});\n"
      "})();\n")
sys.stdout.write(js)
print(f"// {len(E)} entradas nuevas o rehechas, {len(DEL)} retiradas", file=sys.stderr)
