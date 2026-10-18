import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super().showPage()
        super().save()

    def draw_header_footer(self, total_pages):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(40, 810, "MOVY MOBILIDADE URBANA - PLANO DE RECRIARÇÃO DO ZERO (EUA & BRASIL)")
            self.drawRightString(555, 810, "DOCUMENTO EXECUTIVO DE ENGENHARIA")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(40, 804, 555, 804)
        
        # Footer
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(40, 35, 555, 35)
        
        page_text = f"Página {self._pageNumber} de {total_pages}"
        self.drawString(40, 24, "CONFIDENCIAL & ESTRATÉGICO - DIRETORIA & ENGENHARIA MOVY")
        self.drawRightString(555, 24, page_text)
        self.restoreState()

def create_audit_pdf(output_pdf_path):
    doc = SimpleDocTemplate(
        output_pdf_path,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=48,
        bottomMargin=48
    )

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#070A1A'),
        spaceAfter=4
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#00349A'),
        spaceAfter=12
    )
    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#070A1A'),
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )
    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor('#00349A'),
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#1E293B'),
        spaceAfter=5
    )
    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor('#1E293B')
    )
    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=table_cell,
        fontName='Helvetica-Bold',
        textColor=colors.HexColor('#070A1A')
    )
    table_cell_white = ParagraphStyle(
        'TableCellWhite',
        parent=table_cell,
        fontName='Helvetica-Bold',
        textColor=colors.white
    )

    story = []

    # Title
    story.append(Paragraph("MOVY - ESPECIFICAÇÃO DE RECRIARÇÃO INTEGRAL DO ZERO", title_style))
    story.append(Paragraph("Operação Internacional (EUA & Brasil) • Padrão Visual Superior a Uber e 99 • Zelle & Pix", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2.5, color=colors.HexColor('#04F3FA'), spaceBefore=2, spaceAfter=10))

    # Meta
    meta_data = [
        [
            Paragraph("<b>Mercado de Operação:</b> Estados Unidos (EUA) e Brasil", table_cell),
            Paragraph("<b>Moeda Padrão:</b> Dólar Americano ($ USD) / Real (R$)", table_cell),
            Paragraph("<b>Saque Motorista:</b> Zelle Instantâneo / Pix", table_cell)
        ],
        [
            Paragraph("<b>Login Principal:</b> E-mail e Senha (SMS controlável)", table_cell),
            Paragraph("<b>Cadastro nos EUA:</b> Zero CPF / Sem burocracia", table_cell),
            Paragraph("<b>Módulo de Propostas:</b> MOVY NEGOCIA", table_cell)
        ]
    ]
    t_meta = Table(meta_data, colWidths=[175, 175, 165])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 10))

    # 1. DIRETRIZES CENTRAIS
    story.append(Paragraph("1. DIRETRIZES DE ENGENHARIA & REGRAS DE NEGÓCIO", h1_style))
    story.append(Paragraph(
        "A reconstrução completa do ecossistema MOVY substituirá todo o código legado sem reaproveitamento de débitos técnicos. "
        "A plataforma operará prioritariamente em solo norte-americano com suporte total a múltiplos países:",
        body_style
    ))

    rules_data = [
        [Paragraph("Área do Sistema", table_cell_white), Paragraph("Diretriz Específica do Cliente", table_cell_white), Paragraph("Implementação Técnica", table_cell_white)],
        [Paragraph("<b>Cadastro EUA vs Brasil</b>", table_cell), Paragraph("<b>NUNCA pedir CPF nos Estados Unidos.</b> CPF deve aparecer exclusivamente se o país selecionado for Brasil.", table_cell), Paragraph("Validação dinâmica: EUA valida ZIP Code (5 dígitos) e DL. Brasil valida CPF (11 dígitos) e CNH.", table_cell)],
        [Paragraph("<b>Saque do Motorista</b>", table_cell), Paragraph("O saque deve ser via <b>Zelle</b> para motoristas nos EUA e via <b>Pix</b> para motoristas no Brasil.", table_cell), Paragraph("Integração bancária com Zelle Instant Cashout em Dólar ($) e Webhook Pix em Real (R$).", table_cell)],
        [Paragraph("<b>Módulo de Propostas</b>", table_cell), Paragraph("Não usar a palavra 'leilão', e sim <b>'NEGOCIA'</b>.", table_cell), Paragraph("Módulo <b>MOVY Negocia</b> com botões rápidos: EUA (+$1, +$2, +$3, +$5) e Brasil (+R$2, +R$3, +R$5, +R$10).", table_cell)],
        [Paragraph("<b>Método de Login</b>", table_cell), Paragraph("Login principal ativado por <b>E-mail e Senha</b>. Login por telefone SMS deve ser ativável no Monitor.", table_cell), Paragraph("Feature Flag <code>enable_phone_login_otp</code> no banco e painel Monitor; tela de e-mail como fluxo padrão.", table_cell)],
        [Paragraph("<b>Fiscalização Municipal</b>", table_cell), Paragraph("QR Code de alvará municipal <b>desativado por padrão</b> no app do motorista.", table_cell), Paragraph("Feature Flag <code>enable_municipal_fiscal_qrcode</code> gerenciada com um clique no Monitor.", table_cell)],
        [Paragraph("<b>Design & Cores</b>", table_cell), Paragraph("Sem breguice. Calibrar perfeitamente com as <b>cores reais da logo MOVY</b>.", table_cell), Paragraph("Fundo Deep Navy Obsidian (#070A1A), Ciano Elétrico (#04F3FA) e Azul Royal (#00349A). Contraste WCAG AAA.", table_cell)]
    ]
    t_rules = Table(rules_data, colWidths=[95, 210, 210])
    t_rules.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#070A1A')),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#FFFFFF')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor('#FFFFFF'), colors.HexColor('#F8FAFC')]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_rules)
    story.append(Spacer(1, 8))

    # 2. DESIGN & BENCHMARK
    story.append(Paragraph("2. IDENTIDADE VISUAL & BENCHMARK SUPERIOR A UBER E 99", h1_style))
    story.append(Paragraph(
        "A nova linguagem visual elimina a frieza rígida da Uber e a poluição pesada da 99, introduzindo uma estética de luxo e eficiência:",
        body_style
    ))

    ux_data = [
        [Paragraph("Pilar de UX/Design", table_cell_white), Paragraph("Uber & 99", table_cell_white), Paragraph("Novo Ecossistema MOVY", table_cell_white)],
        [Paragraph("<b>Linguagem Visual</b>", table_cell), Paragraph("Uber monocromática sem vida; 99 amarela saturada e poluída.", table_cell), Paragraph("<b>Deep Navy Obsidian Neo-Automotivo</b> com detalhes no Ciano Elétrico da logo MOVY (#04F3FA).", table_cell)],
        [Paragraph("<b>Fluidez do Mapa</b>", table_cell), Paragraph("Carros pulam na tela de 3 em 3 segundos com movimentos rígidos.", table_cell), Paragraph("<b>Interpolação Bézier a 60 FPS:</b> o carrinho faz curvas na rua de forma suave e contínua.", table_cell)],
        [Paragraph("<b>Negociação</b>", table_cell), Paragraph("Preço fechado e imposto pelo algoritmo, sem flexibilidade.", table_cell), Paragraph("<b>MOVY Negocia:</b> passageiro propõe valor e motorista contrapropõe com 1 toque no polegar.", table_cell)],
        [Paragraph("<b>Segurança</b>", table_cell), Paragraph("Código básico de 4 dígitos ou gravação oculta.", table_cell), Paragraph("<b>Central de Segurança Ativa:</b> PIN de embarque, áudio criptografado e link com bateria do celular.", table_cell)],
        [Paragraph("<b>Cockpit Motorista</b>", table_cell), Paragraph("Telas com menus pequenos e anúncios que atrapalham.", table_cell), Paragraph("<b>HUD Ergonômico:</b> Botões gigantes, meta diária em anel e saque imediato via Zelle/Pix.", table_cell)]
    ]
    t_ux = Table(ux_data, colWidths=[95, 205, 215])
    t_ux.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#070A1A')),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#FFFFFF')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor('#FFFFFF'), colors.HexColor('#F8FAFC')]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_ux)
    story.append(Spacer(1, 8))

    story.append(PageBreak())

    # 3. ESCOPO DOS APLICATIVOS
    story.append(Paragraph("3. ESCOPO COMPLETO DOS NOVOS APLICATIVOS (ANDROID & IOS)", h1_style))
    
    story.append(Paragraph("3.1. Aplicativo do Passageiro (52 Telas)", h2_style))
    story.append(Paragraph(
        "• <b>Autenticação:</b> Login primário por E-mail e Senha; opção de telefone apenas se ativada no Monitor.<br/>"
        "• <b>Cadastro Bi-Nacional:</b> Nos EUA, cadastro rápido em 30 segundos (sem CPF); no Brasil, fluxo nacional com CPF.<br/>"
        "• <b>Mapa & Categorias:</b> MOVY Eco, Comfort, Speed/Moto, Fretes e <b>MOVY Negocia</b>, com preço em Dólar ($) ou Real (R$).<br/>"
        "• <b>Cupons Promocionais:</b> Inserção de vouchers e aplicação dinâmica de descontos (ex: MOVYUSA, BEMVINDO).<br/>"
        "• <b>Viagens Agendadas:</b> Reserva antecipada com data e horário para aeroportos e rotas habituais.<br/>"
        "• <b>Chat em Tempo Real:</b> Comunicação direta motorista-passageiro com envio de mensagens de voz/áudio e respostas rápidas.<br/>"
        "• <b>Botão de Pânico & SOS:</b> Chamada direta de emergência para 911 (EUA) ou 190 (Brasil) com compartilhamento de GPS ao vivo.<br/>"
        "• <b>Pagamentos Nativos:</b> Cartões salvos tokenizados, Apple Pay / Google Pay, Zelle e Pix.<br/>"
        "• <b>Segurança no Embarque:</b> PIN dinâmico de 4 dígitos obrigatório para o motorista iniciar a viagem.",
        body_style
    ))
    story.append(Spacer(1, 4))

    story.append(Paragraph("3.2. Aplicativo do Motorista (38 Telas - 100% Estável no iOS)", h2_style))
    story.append(Paragraph(
        "• <b>Cockpit Ergonômico:</b> Modo noturno antirreflexo, botões grandes e velocímetro integrado.<br/>"
        "• <b>Ofertas & MOVY Negocia:</b> Visualização do valor líquido e botões de contraproposta (+ $1, + $2, + $3, + $5).<br/>"
        "• <b>Ganhos & Saque Rápido:</b> Anel de meta diária animado e botão <b>Cash Out (Zelle)</b> nos EUA e <b>Pix</b> no Brasil.<br/>"
        "• <b>Envio & Auditoria de Documentos:</b> Upload de Driver's License, Antecedentes e Seguro (EUA) ou CNH e CRLV (Brasil).<br/>"
        "• <b>Corridas Agendadas:</b> Fila de corridas reservadas com aceitação prévia pelo motorista.<br/>"
        "• <b>Eliminação de Crashes no iPhone:</b> Remoção definitiva da injeção indevida do pacote Android BubbleButton no iOS.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # 4. PAINÉIS WEB & BANCO DE DADOS
    story.append(Paragraph("4. CENTRAL DE DESPACHO, MONITOR DE FROTAS & BANCO DE DADOS", h1_style))
    story.append(Paragraph(
        "• <b>Central de Despacho (`movycentral.com` - Next.js 15):</b> Criação de corridas em menos de 8 segundos por telefone, integração com WhatsApp para envio de link com a rota do carro e suporte a pedidos em Dólar ou Real.<br/>"
        "• <b>Monitor de Frotas (`movymonitor.com` - Next.js 15):</b> Gestão de motoristas, fila de auditoria e aprovação de documentos em tempo real, gestão de cupons, monitor de emergências SOS e interruptores de Feature Flags.<br/>"
        "• <b>Banco de Dados Saneado:</b> As 403 tabelas desordenadas consolidadas com campos monetários em <code>DECIMAL(12,2)</code> (precisão de centavos), indexação espacial de GPS e padronização em <code>utf8mb4_unicode_ci</code>.<br/>"
        "• <b>Servidor de WebSockets:</b> Clusterizado com Redis no DigitalOcean, atingindo latência de GPS menor que 50ms.",
        body_style
    ))
    story.append(Spacer(1, 10))

    # 5. ROTEIRO DE EXECUÇÃO
    story.append(Paragraph("5. CRONOGRAMA DE ENTREGA SEM INTERRUPÇÃO", h1_style))
    
    plan_steps = [
        [Paragraph("Etapa", table_cell_white), Paragraph("Escopo de Implementação", table_cell_white), Paragraph("Resultado", table_cell_white)],
        [Paragraph("<b>Etapa 1</b>", table_cell), Paragraph("Estruturação do Novo Banco de Dados: Tabelas normalizadas, suporte nativo a USD/BRL, Zelle/Pix e Feature Flags.", table_cell), Paragraph("Base de dados rápida e blindada.", table_cell)],
        [Paragraph("<b>Etapa 2</b>", table_cell), Paragraph("Core Backend & WebSockets: API NestJS e servidor de tempo real com Redis no DigitalOcean.", table_cell), Paragraph("Comunicação em menos de 50ms.", table_cell)],
        [Paragraph("<b>Etapa 3</b>", table_cell), Paragraph("Novo App Passageiro: 52 telas nas cores MOVY, sem CPF nos EUA, MOVY Negocia e PIN de segurança.", table_cell), Paragraph("App limpo, moderno e rápido.", table_cell)],
        [Paragraph("<b>Etapa 4</b>", table_cell), Paragraph("Novo App Motorista: Cockpit de corrida, Zelle Cashout, botões de contraproposta e build estável no iOS.", table_cell), Paragraph("Zero crashes na App Store.", table_cell)],
        [Paragraph("<b>Etapa 5</b>", table_cell), Paragraph("Central & Monitor Web: Painéis Next.js 15 com chaves de login/fiscalização e mapa holográfico.", table_cell), Paragraph("Gestão completa e intuitiva.", table_cell)]
    ]
    t_plan = Table(plan_steps, colWidths=[65, 345, 105])
    t_plan.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#070A1A')),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#FFFFFF')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor('#FFFFFF'), colors.HexColor('#F8FAFC')]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_plan)
    story.append(Spacer(1, 12))

    # Sign-off
    sign_data = [
        [Paragraph("<b>Plano Aprovado para Execução Contínua:</b> Ecossistema MOVY International", table_cell_bold),
         Paragraph("<b>Versão:</b> 2.0 - Outubro 2026", table_cell)]
    ]
    t_sign = Table(sign_data, colWidths=[365, 150])
    t_sign.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F1F5F9')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_sign)

    doc.build(story, canvasmaker=NumberedCanvas)
    print("Updated PDF generated successfully!")

if __name__ == "__main__":
    base_folder = r"d:\APLICATIVO MOVY\AUDITORIA DO PROJETO COMPLETO PARA RECRIAR TUDO QUE EXISTE DO ZERO"
    target_pdf = os.path.join(base_folder, "AUDITORIA_COMPLETA_ECOSSISTEMA_MOVY.pdf")
    create_audit_pdf(target_pdf)
