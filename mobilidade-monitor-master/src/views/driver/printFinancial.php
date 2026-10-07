<span id='idDriver' style='display: none;'><?php echo $this->params[0] ?></span>
<div id='printable'> 
  <div class='title-head'>
    <img class="logo-monitor">
    <h2>Relatório de viagens</h2>
  </div>
<!--  <fieldset>-->
<!--    <legend>TOTAIS</legend>-->
<!--    <p class='detalhes'><span>VIAGEM:       <strong>R$ 0,00</strong></span></p>-->
<!--    <p class='detalhes'><span>TAXA APP:     <strong>R$ 0,00</strong></span></p>-->
<!--    <p class='detalhes'><span>IMPOSTO:      <strong>R$ 0,00</strong></span></p>-->
<!--    <p class='detalhes'><span>TAXA PG:      <strong>R$ 0,00</strong></span></p>-->
<!--    <p class='detalhes'><span>BONIFICAÇÕES: <strong>R$ 0,00</strong></span></p>-->
<!--    <p class='detalhes'><span>LIQUIDO:      <strong>R$ 0,00</strong> </span></p>-->
<!--  </fieldset>-->
  <p class='detalhes'><span> motorista: </span> <span id='nameDriver'></span></p>
  <p class='detalhes'><span> data: </span> <span id='dateAtual'></span></p>
  <p class='detalhes'><span> período: </span> <span id='periodo'></span></p>
  <table>
    <thead>
      <tr>
        <th>DATA VIAGEM</th>
        <th>NOME</th>
        <th>PAGAMENTO</th>
        <th>TIPO REPASSE</th>
        <th>VIAGEM $</th>
        <th>TAXA APP (-)</th>
        <th>IMPOSTOS (-)</th>
        <th>TAXA DE PG (-)</th>
        <th>BONIFICAÇÕES (+)</th>
        <th>LIQUIDO $</th>
      </tr>
    </thead>
    <tbody id='table-financial'>  
    </tbody>
  </table>
  <p class='detalhes'><span><span id="cidade_app"></span></span><span id='dataAtualFormatada'></span></p>
  <p class='detalhes'><span>controle e gestão de valores</span></p>
</div>