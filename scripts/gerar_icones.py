"""Gera os ícones do app (PWA e Android) desenhando um D20 no estilo Galáxia.

Uso: python scripts/gerar_icones.py   (precisa do Pillow)
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

RAIZ = Path(__file__).resolve().parent.parent
MADEIRA = (90, 44, 20)


def fonte(tamanho):
    for nome in ["DejaVuSans-Bold.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "arialbd.ttf"]:
        try:
            return ImageFont.truetype(nome, tamanho)
        except OSError:
            continue
    return ImageFont.load_default()


def fundo_madeira(lado):
    img = Image.new("RGB", (lado, lado), MADEIRA)
    d = ImageDraw.Draw(img)
    for x in range(-lado, lado * 2, max(4, lado // 60)):
        tom = 70 + (x * 7919 % 40)
        d.line([(x, 0), (x + lado // 8, lado)], fill=(tom + 40, tom // 2 + 10, 14), width=max(1, lado // 200))
    return img.filter(ImageFilter.GaussianBlur(lado / 300))


def dado(lado, escala=0.8):
    """D20 visto de cima, transparente fora do hexágono."""
    img = Image.new("RGBA", (lado, lado), (0, 0, 0, 0))
    c = lado / 2
    r = lado * escala / 2
    hexagono = [(c + r * math.sin(math.radians(a)), c - r * math.cos(math.radians(a))) for a in range(0, 360, 60)]

    # Fundo de galáxia: gradiente radial azul
    grad = Image.new("RGBA", (lado, lado))
    gd = ImageDraw.Draw(grad)
    cores = [(234, 246, 255), (168, 216, 255), (79, 155, 224), (42, 98, 168), (23, 58, 114), (11, 26, 61)]
    for i in range(int(r * 1.3), 0, -1):
        t = i / (r * 1.3)
        idx = min(int(t * (len(cores) - 1)), len(cores) - 2)
        f = t * (len(cores) - 1) - idx
        cor = tuple(int(cores[idx][k] * (1 - f) + cores[idx + 1][k] * f) for k in range(3))
        cx, cy = c - r * 0.2, c - r * 0.25
        gd.ellipse([cx - i, cy - i, cx + i, cy + i], fill=cor + (255,))
    mascara = Image.new("L", (lado, lado), 0)
    ImageDraw.Draw(mascara).polygon(hexagono, fill=255)
    img.paste(grad, (0, 0), mascara)

    d = ImageDraw.Draw(img)
    # Faces: triângulo de cima e linhas das arestas
    topo = [(c, c - r * 0.62), (c + r * 0.537, c + r * 0.31), (c - r * 0.537, c + r * 0.31)]
    linha = max(1, int(lado / 170))
    for a, b in [(0, 1), (1, 2), (2, 0)]:
        d.line([topo[a], topo[b]], fill=(255, 255, 255, 110), width=linha)
    # Arestas entre o hexágono e a face de cima (como no desenho do site)
    arestas = [(0, 0), (1, 0), (1, 1), (2, 1), (3, 1), (3, 2), (4, 2), (5, 2), (5, 0)]
    for h, t_ in arestas:
        d.line([hexagono[h], topo[t_]], fill=(255, 255, 255, 90), width=linha)
    d.polygon(hexagono, outline=(255, 255, 255, 140), width=linha)

    # Estrelas
    for i in range(40):
        x = c + (math.sin(i * 12.9898) * 43758.5453 % 1) * r * 1.6 - r * 0.8
        y = c + (math.sin(i * 78.233) * 12345.678 % 1) * r * 1.6 - r * 0.8
        s = lado / 400
        if math.hypot(x - c, y - c) > r * 0.8:
            continue
        d.ellipse([x - s, y - s, x + s, y + s], fill=(255, 255, 255, 200))

    # Número 20
    f = fonte(int(r * 0.48))
    d.text((c, c + r * 0.06), "20", font=f, anchor="mm", fill=(255, 255, 255),
           stroke_width=max(2, int(lado / 90)), stroke_fill=(5, 10, 30))
    return img


def salvar(img, caminho):
    caminho.parent.mkdir(parents=True, exist_ok=True)
    img.save(caminho)
    print("gerado", caminho.relative_to(RAIZ))


# PWA: ícones comuns (dado sobre madeira com cantos) e "maskable" (área segura no centro)
for tamanho in (192, 512):
    base = fundo_madeira(tamanho).convert("RGBA")
    base.alpha_composite(dado(tamanho, 0.86))
    salvar(base.convert("RGB"), RAIZ / f"public/icons/icone-{tamanho}.png")
    mask = fundo_madeira(tamanho).convert("RGBA")
    mask.alpha_composite(dado(tamanho, 0.62))
    salvar(mask.convert("RGB"), RAIZ / f"public/icons/icone-maskable-{tamanho}.png")

apple = fundo_madeira(180).convert("RGBA")
apple.alpha_composite(dado(180, 0.86))
salvar(apple.convert("RGB"), RAIZ / "public/icons/apple-touch-icon.png")

fav = dado(64, 0.98)
salvar(fav, RAIZ / "public/favicon.png")

# Android (Capacitor Assets): ícone, camadas do ícone adaptativo e tela de abertura
salvar(Image.alpha_composite(fundo_madeira(1024).convert("RGBA"), dado(1024, 0.86)).convert("RGB"), RAIZ / "assets/icon-only.png")
salvar(dado(1024, 0.6), RAIZ / "assets/icon-foreground.png")
salvar(fundo_madeira(1024), RAIZ / "assets/icon-background.png")
splash = fundo_madeira(2732).convert("RGBA")
splash.alpha_composite(dado(2732, 0.3))
salvar(splash.convert("RGB"), RAIZ / "assets/splash.png")
salvar(splash.convert("RGB"), RAIZ / "assets/splash-dark.png")
