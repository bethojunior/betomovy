<div class="container">
    <div class="data-info-customer">
        <img src="<?= Host::getLocal(); ?>webfiles/img/logo/logo-conceito.png">
        <h3>Cadastro de parceiros</h3>
        <p class="name-user"></p>
        <p class="phone-user"></p>
        <p class="email-user"></p>
    </div>
    <form id="formPartner">
        <ul>
            <li>
                <div>
                    <span>Nome do estabelecimento onde trabalha</span>
                    <input type="text" id="nameEstablishment" required/>
                </div>
            </li>
            <li>
                <div>
                    <span>Endereço</span>
                    <input type="text" id="address" required/>
                </div>
            </li>
            <li>
                <div>
                    <spa>Sua Função</spa>
                    <input type="text" id="function" required/>
                </div>
            </li>
            <li>
                <div>
                    <span>Li e concordo os termos conforme o <a href="#" id="modalTerms">link</a></span>
                    <p><input type="checkbox" id="confirmation"/> Aceite</p>
                </div>
            </li>
        </ul>
        <button type="submit" id="btnSubmit">Finalizar</button>
    </form>
    <div class="success-partner">
        <img src="<?= Host::getLocal(); ?>webfiles/img/svg/success-partner.svg">
        <p>Tudo certo, agora é só aguardar a liberação de seu cadastro, em breve você receberá uma mensagem com
            informações de uso e de como receber seu lucros em sua conta.</p>
        <button type="button" id="done">Concluir</button>
    </div>
</div>

<div class="modal-terms-partner">
    <div>
        <h4>Termos de uso</h4>
        <p><span>1. A aceitação dos TERMOS DE USO é obrigatória para a utilização dos serviços prestados pelo serviço
            TAXIRETURN e a mera utilização do APLICATIVO implica a imediata concordância com todas as suas
            cláusulas, políticas e princípios.</span>
            <span>2. O presente TERMO DE USO aplica-se apenas e tão somente ao TAXIRETURN enquanto na fase de piloto, ou
            seja, no período em que o modelo de funcionamento estiver sendo testado com os taxistas, empresa e
            passageiros voluntários, não sendo extensível ao programa uma vez que esteja em sua solução definitiva,
            quanto passará a ter regras próprias e específicas, o app teste esta identificado com a marca “Versão
                Beta” na abertura do mesmo.</span>
            <span>3. Os TERMOS DE USO são mostrados ao TAXISTA e por ele necessariamente aceitos quando do início do
            processo de instalação, cadastro e utilização do APLICATIVO, e dada sua publicidade não permitem que o
                TAXISTA alegue desconhecimento das regras e obrigações criadas por meio deles.</span>
            <span>4. Sobre as responsabilidades pelo funcionamento do aplicativo
            a. O Serviço TAXIRETURN não será responsabilizado:<br/>
            i. Pelos eventuais erros e inconsistências das informações oriundas de terceiros relativas ao
            geoposicionamento via sistema GPS e aos mapas integrados ao APLICATIVO;<br/>
            ii. Pelo uso inadequado do APLICATIVO por qualquer USUÁRIO, nem pelos problemas, danos ou prejuízos dele
            decorrentes;<br/>
            iii. Pelo atraso, cancelamento, falha ou por quaisquer problemas de comunicação entre TAXISTA e
            CLIENTES;<br/>
            iv. Pela geração de informações inconsistentes em seus relatórios diversos.<br/>
            b. Sem prejuízo de outras obrigações decorrentes destes TERMOS DE USO, o TAXISTA obriga-se a:<br/>
            i. Responder pelo uso incorreto, indevido ou fraudulento do APLICATIVO;<br/>
            ii. Possuir e manter em funcionamento regular os equipamentos técnicos e operacionais necessários para a
            utilização do APLICATIVO e para a prestação de serviços realizada pelo TAXISTA;<br/>
            iii. Se responsabilizar pelo uso de sua própria máquina de cartão de crédito e/ou débito quando for este
            o caso, e pelos seus respectivos recebimentos, guardando seus comprovantes quando houver para eventuais
        reclamações aos seus respectivos responsáveis.<br/></span>
        <span>5. Sobre o feedback “retorno de informações”.<br/>
            a. O TAXISTA terá até 24 horas para enviar reclamação pelo WhatsApp número 85-9999 8877 ou pelo e-mail
            suporte@eassessotaxi.com.br, contendo detalhadamente sua dúvida ou relação, e estando a disposição para
            se necessários complementar as informações para possível correção do APLICATIVO.</span>
        <span> 6. Sobre o uso Individual:
            a. O uso do Aplicativo TAXIRETURN é pessoa e intransferível, o acesso por mais de uma pessoa no mesmo
            APLICATIVO, é passivo de bloqueio do mesmo.<br/>
            b. As informações de suas corridas e cancelamentos, é registrado em arquivo LOG, podendo ser resgatado
            para verificar o uso da parte do TAXISTA e assim entender as ações por ele feita no APLICATIVO.<br/>
            c. O TAXISTA se prontifica a prestar esclarecimentos sempre que necessário para dirimir dúvidas sobre o
            manuseio ou algum problema recorrente do APLICATIVO.<br/>
        </span>
        <span>7. Sobre Bloqueio.
            a. Por tratar-se de uma validação de um produto “TAXIRETURN”, fica avisado que a qualquer momento o
            aplicativo pode paralisar em parte ou em sua plenitude suas atividades e operações, ficando a cargo da
            gestora do aplicativo esta decisão, não incidindo qualquer compensação ao TAXISTA por esta ação.<br/>
            b. Bloqueio de TAXISTA pode ocorrer sempre que o sistema de controle localizar movimentação estranha ao
            normal, sendo inicialmente bloqueado e chegando a exclusão do cadastro do TAXISTA a depender da<br/>
            gravidade da ação monitorada.</span>
        </p>
        <div>
            <button type="button" class="option-term" value="1">ACEITAR</button>
            <button type="button" class="option-term" value="0">RECUSAR</button>
        </div>
    </div>

</div>