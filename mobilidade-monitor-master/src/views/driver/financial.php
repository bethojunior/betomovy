<div class="container-default-monitor">
    <div class='list-btns-header'>
        <button class='btn-filter-financial' id='toggleModal'>
            <i class="material-icons">tune</i>
        </button>
        <a target='_blank' href='/driver/<?php echo $this->params[0]; ?>/report'>
            <button class='btn-filter-financial' id='toggleModal'>
                <i class="material-icons">print</i>
            </button>
        </a> 
    </div> 
    <span id='idDriver' class='none-element'><?php echo $this->params[0]; ?></span>
    <h2 class='title-financial-driver'>Últimas movimentações</h2>
    <h3 id="nameDriver"></h3>
    <ul id='listFinancialDriver' class='main-timeline'>
         
    </ul> 
</div>