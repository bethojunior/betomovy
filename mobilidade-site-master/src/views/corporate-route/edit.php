<div class="container-index">
    <form id="formSchedule">
        <div class="row">
            <div class="input-field col s12  m6 l3">
                <p class="m"><label>Titulo</label></p>
                <br/>
                <input type="text" id="titleRoute" placeholder=" " required>
            </div>
            <div class="input-field col s12  m6 l3">
                <p class="m"><label>Vagas</label></p>
                <br/>
                <input type="number" id="vacanciesRoute" placeholder=" " required>
            </div>
        </div>
        <div class="row">
            <div class="input-field col s12  m6 l3">
                <p class="m"><label>Horário de início</label></p>
                <br/>
                <input type="time" id="scheduleRoute" placeholder=" " required>
            </div>
        </div>
        <p>
            <input type="checkbox" class="weekdays-option" id="sunday" value="7"/>
            <label for="sunday">Domingo</label>
        </p>
        <p>
            <input type="checkbox" class="weekdays-option" id="monday" value="1"/>
            <label for="monday">Segunda-Feira</label>
        </p>
        <p>
            <input type="checkbox" class="weekdays-option" id="tuesday" value="2"/>
            <label for="tuesday">Terça-Feira</label>
        </p>
        <p>
            <input type="checkbox" class="weekdays-option" id="wednesday" value="3"/>
            <label for="wednesday">Quarta-Feira</label>
        </p>
        <p>
            <input type="checkbox" class="weekdays-option" id="thursday" value="4"/>
            <label for="thursday">Quinta-Feira</label>
        </p>
        <p>
            <input type="checkbox" class="weekdays-option" id="friday" value="5"/>
            <label for="friday">Sexta-Feira</label>
        </p>
        <p>
            <input type="checkbox" class="weekdays-option" id="saturday" value="6"/>
            <label for="saturday">Sábado</label>
        </p>
        <button type="submit" id="btnAddSchedule" class="waves-effect waves-light btn">Salvar</button>
    </form>
</div>