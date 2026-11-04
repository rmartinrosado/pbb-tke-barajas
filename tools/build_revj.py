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

# ajustes puntuales sobre entradas existentes (sin rehacerlas)
PATCH = [
    # E-A10: los selectores CP-S16 pasan por P-X92.1 (no P-X92.2) en la rev. J
    ("E-A10", ["5.1", "5.2", "6.1", "6.2", "7.1", "7.2"], "+P-X92.2", "+P-X92.1"),
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
      "/* entradas de seguridad cuyo enlace a la salida de test (UT) quedó sin nombre: se toma de la borna x.2 del mismo grupo */\n"
      "Object.keys(C).forEach(function(k){var e=C[k];if(!/S$/.test(e.k||''))return;var L=e.n[e.n.length-1];"
      "if(!L||L.k!=='M'||L.l&&L.l!=='undefined')return;var g=e.b.split('.')[0],u=C[e.m+'|'+g+'.2|'+e.f];L.l=u&&/^UT/.test(u.k)?u.k:'UT'});\n"
      "})();\n")
sys.stdout.write(js)
print(f"// {len(E)} entradas nuevas o rehechas, {len(DEL)} retiradas", file=sys.stderr)
