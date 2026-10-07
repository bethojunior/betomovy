<section class="title-mobile">
    <a href=""><img src="<?= Host::getLocal(); ?>webfiles/img/icons/left-arrow.png" alt="Voltar"></a>
    <h2>CADASTRO</h2>
</section>
<section class="form-group step-1" id="information-basic" style='margin-top: 9%;'>
    <h1>Informações Básicas</h1> 
    <div class="group-input between">
        <input type="text" placeholder="Nome do Hotel/ Pousada" class="width-input-inf-name " id="inf-name"/>
        <input type="text" placeholder="CEP" class="width-input-inf-cep mask-cep" id="inf-cep"/>
        <input type="text" placeholder="Rua" class="width-input-inf-rua" id="inf-rua"/>
    </div>
    <div class="group-input between">
        <input type="number" placeholder="Número" class="width-input-inf-numero" min='0' id="inf-numero"/>
        <input type="text" placeholder="Bairro" class="width-input-inf-bairro" id="inf-bairro"/>
        <select  class="width-input-inf-uf" id="inf-uf" >
            <option value="" >Estado</option>
        </select>
        <select class="width-input-inf-cidade" id="inf-cidade">
            <option value="">Cidade</option>
        </select>
    </div> 
    <div class="group-input"> 
        <input type="text" placeholder="CNPJ" class="width-input-inf-cnpj mask-cnpj validate-cnpj" id="inf-cnpj"/>
    </div> 
    <div class="group-input center-intens">
        <button class="btn-mobile" id="btn-step-1" >Continuar</button>   
    </div>   
</section>
<section class="form-group step-2" id="information-basic-start">
    <h1>Visão geral</h1>
    <div class="group-input between">
        <div class="group-input-item">
            <label class="label-ranking">Classificação</label>
            <div class="width-input-inf-start">
                <i class="fas fa-star start" value="0"></i>
                <i class="fas fa-star start" value="1"></i>
                <i class="fas fa-star start" value="2"></i>
                <i class="fas fa-star start" value="3"></i>
                <i class="fas fa-star start" value="4"></i>
            </div> 
        </div>
        <div class="group-input-item">
            <label class="label-dmin label-adm-mobile">Diaria minima</label>
            <input type="text" id="num1"  class="width-input-inf-media-minima mask-money" />
        </div>
        <div class="group-input-item label-diaria-mobile">
            <label class="label-dma   ">Diaria maxima</label>
            <input type="text" id="num2"  class="width-input-inf-media-maxima mask-money" />
        </div>
        <div class="group-input-item label-media-mobile">
        <label class="label-media">Média</label>
             <input id="resultado"  class="width-input-inf-media mask-money" disabled/>
        </div>
        
        <div class="group-input center-intens">
            <button class="btn-mobile" id="btn-step-2" >Continuar</button>   
        </div>
    </div>
    <div class="group-input between">
        <div class="group-input-item">
            <label class="label-dmin label-adm-mobile">Desconto por indicação %</label>
            <input type="text" id="hostelDiscount"  class="width-input-inf-media-minima mask-money" />
        </div>
    </div>
        
</section>

<div class="group-input center-intens">
    <button class="btn-submit-salvar-mobile" id="btn-salvar-inf-basic-start" style="display:none">Salvar</button>   
</div>

<section class="form-group step-3" id="contact">

    <h1>Contato</h1>

    <div class="group-input between">
        <input type="email" title='Adicione o @' placeholder="E-mail Comercial" class="width-input-inf-equal email validate-email" id="email-comercial"/>
        <input type="text" placeholder="Telefone Comercial" class="width-input-inf-equal mask-telefone" id="fone-comercial"/>
        <input type="email" placeholder="E-mail administrativo" class="width-input-inf-equal email validate-email" id="email-adm"/>
        <input type="text" placeholder="Telefone administrativo" class="width-input-inf-equal mask-telefone" id="fone-adm"/>
    </div>
    
    <div class="group-input center-intens">
        <button class="btn-mobile" id="btn-step-3" >Continuar</button>   
    </div>
    
</section>

<section class="form-group step-4" id="bank-data">
    <h1>Dados Bancarios</h1> 
    <div class="group-input between">
        <select  class="width-input-inf-equal bankList" id="bankName">
            <option value="">Bancos</option>
        </select>
        <input type="text" placeholder="OP" class="width-input-inf-equal width-input-inf-equal-mobi" id="bankOp"/>
        <input type="text" placeholder="Agência" class="width-input-inf-equal width-input-inf-equal-mobi" id="bankAgencia"/>
        <input type="text" placeholder="Conta"  class="width-input-inf-equal width-input-inf-equal-mobi" id="bankConta"/>
        <input type="text" placeholder="Dígito" class="width-input-inf-equal-mobi" id="accountDV"/>
    </div>

    <div class="group-input between">
        <select  class="width-input-inf-equal bankList" id="bankType">
            <option value="corrente">Corrente</option>
            <option value="poupanca">Poupança</option>
        </select>
        <input type="text" placeholder="Titular da conta" class="width-input-inf-equal width-input-inf-equal-mobi" id="bankHolderName"/>
        <select  class="width-input-inf-equal bankList" id="documentType">
            <option value="">Tipo de documento</option>
            <option value="cpf">CPF</option>
            <option value="cnpj">CNPJ</option>
        </select>
        <input type="text" placeholder="Documento" class="width-input-inf-equal width-input-inf-equal-mobi" id="bankDocument"/>
        <input type="text" placeholder="hidden" class="width-input-inf-equal width-input-inf-equal-mobi" hidden />
    </div>
    
    <div class="group-input center-intens">
        <button class="btn-mobile" id="btn-step-4" >Continuar</button>   
    </div>
    
</section>
<section class="form-group step-5" id="add-photos">
    <h1>Adicionar fotos</h1>  
    <div class="image-container">
        <div class="main-image">
            <label for="image-1"><img src="<?= Host::getLocal(); ?>webfiles/img/picture.png"  alt="Imagem 1" id="image-1-hostel"></label>
            <input type="file" id="image-1" class="get-image">
        </div>
        <div class="alternative-images">
            <div class="block-image">
                <label for="image-2"><img src="<?= Host::getLocal(); ?>webfiles/img/ICON_MAIS.png" alt="Imagem 2" id="image-2-hostel"></label>
                <input type="file" id="image-2" class="get-image">
            </div>

            <div class="block-image">
                <label for="image-3"><img src="<?= Host::getLocal(); ?>webfiles/img/ICON_MAIS.png" alt="Imagem 3" id="image-3-hostel" ></label>
                <input type="file" id="image-3" class="get-image">
            </div>

            <div class="block-image">
                <label for="image-4"><img src="<?= Host::getLocal(); ?>webfiles/img/ICON_MAIS.png" alt="Imagem 4" id="image-4-hostel"></label>
                <input type="file" id="image-4" class="get-image">
            </div>

            <div class="block-image">
                <label for="image-5"><img src="<?= Host::getLocal(); ?>webfiles/img/ICON_MAIS.png" alt="Imagem 5" id="image-5-hostel"></label>
                <input type="file" id="image-5" class="get-image">
            </div>
        </div>
    </div> 
    <br/>   
    <p>* Adicione fotos do logitipo do hotel e da faixada</p> 
    <br/>
    <div class="group-input center-intens">
        <button class="btn-mobile" id="btn-step-5" >Continuar</button>   
    </div> 
    
</section> 

<section class="form-group step-6" id="add-colaborador">
    <h1>CADASTRO DE COLABORADOR</h1> 
    <div class="group-input between">
        <input type="text" placeholder="Nome" class="width-input-inf-equal" id='nome-colaborador'/>
        <input type="text" placeholder="Apelido" class="width-input-inf-equal" id='apelido-colaborador'/>
        <input type="text" placeholder="CPF" class="width-input-inf-equal mask-cpf validate-cpf" id='cpf-colaborador'/>
        <input type="text" placeholder="Celular" class="width-input-inf-equal mask-telefone" id='celular-colaborador'/>
    </div>  
    <div class="group-input between">
        <input type="text" placeholder="E-mail" class="width-input-inf-equal validate-email" id="email-colaborador"/> 
        <select class="width-input-inf-equal" id="user-type">
            <option value="1">Gestor da plataforma</option>
            <option value="2">Colaborador</option>
        </select>
        <input type="text" class='width-input-inf-equal' id='occupation' placeholder='Ocupação'/> 
        <input type="password" placeholder="Senha" class="width-input-inf-equal" id="senha-colaborador"/>
     </div>
    <!-- Colaborador tem:  % <input type="text" placeholder="" id="comissao-colaborador" class="width-input-inf-equal mask-money" style="margin-left: 1%;"/> -->
    <div class="group-input center-intens">
        <button class="btn-mobile" id="btn-step-6" >Continuar</button>   
    </div>
    <div class="group-input">
        <button class="btn-submit-add-parceiro" id='add-manager'>Adicionar parceiro</button>
        <button class="btn-submit-add-parceiro hide-element" id='edit-manager'>Editar</button>
    </div>
</section>

<section class="form-group step-7" id="colaboradores-cadastrados">
    <h1>Colaboradores Cadastrados</h1>  
    <div class="group-input">
        <table>
            <thead>
                <tr class="thead-table">
                    <td class="border-radius-td-star">COD</td>
                    <td>NOME</td>
                    <td>FUNÇÃO</td>
                    <td>AÇÕES</td>
                </tr>
            </thead>
           <tbody id='list-manager'>
            
            </tbody>
        </table>
    </div>
    <div class="group-input center-intens">
        <button class="btn-mobile" id="btn-step-7" >Salvar</button>   
    </div> 
</section>

<section class="form-group"> 
    <div class="group-input center-itens">
        <button class="btn-submit-salvar" id="btn-salva-submit">Salvar</button>   
    </div>  
</section> 
<section class="form-group progress-content" style="margin: 0">
    <div class="progress" >
        <div class="progress-width"></div>
    </div>
</section> 