<div class="card">
    <div class="card-header" id="headingOne">
        <h2 class="mb-0">
            <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne">
                Dados do estabelecimento
            </button>
        </h2>
    </div>
    <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
        <div class="card-body">
            <form
                method="POST"
                enctype="multipart/form-data"
                action="{{  route("company.update") }}">
                @csrf
                <div class="form-row relative mb-4">
                    <div class="content-logo-edit">
                        <img
                            id="companyPicture"
                            src="{{$companyDeliveryConfig->picture ?? asset('assets/images/icons/placeholder-store.png')}} ">
                        <input type="file" name="picture" accept="image/*"/>
                        <small>Alterar logo</small>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-4">
                        <label for="name-enterprise">Nome do estabelecimento</label>
                        <input type="text" name="name" class="form-control" id="name-enterprise" value="{{Auth::user()->companyWorker->company->fantasyName}}" required>
                    </div>
                    <div class="form-group col-md-8">
                        <label for="name-enterprise">E-mail do estabelecimento</label>
                        <input type="email" name="email"  class="form-control" id="name-enterprise" value="{{Auth::user()->email}}" required>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary">Salvar</button>
            </form>
        </div>
    </div>
</div>
<script type="text/javascript">
    document.querySelector("input[type='file'][name='picture']").onchange = (event)=>{
        const [file] = event.target.files;

        if(file){
            document.querySelector("#companyPicture").src = URL.createObjectURL(file);
        }
    }
</script>
