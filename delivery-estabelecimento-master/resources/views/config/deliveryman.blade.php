@extends('layouts.page')
@section('title', 'Gerenciamento de Perfil')
@section('content_header')
    <div class="col-lg-12">
        <h1 class="m-0 text-dark">Entregadores</h1>
    </div>
@stop
@section('content_page')
    <button type="button" class="btn btn-primary mb-2" data-toggle="modal" data-target="#deliverymanModal">
        Adicionar um novo entregador
    </button>
    <table class="table">
        <thead>
        <tr>
            <th></th>
            <th>Nome</th>
            <th>E-mail</th>
            <th></th>
            <th></th>
        </tr>
        </thead>
        <tbody>
        @foreach($listDeliveryMan as $deliveryMan)
            <tr>
                <td>
                    <div
                        style="background-image: url({{ $deliveryMan->driver->profileImage }});
                            width: 50px; height: 50px; background-position: center;background-size: cover;
                            background-repeat: no-repeat"></div>
                </td>
                <td>{{ $deliveryMan->driver->user->name }}</td>
                <td>{{ $deliveryMan->driver->user->email }}</td>
                <td>{{ $deliveryMan->driver->user->phone }}</td>
                <td>
                    <form action="{{ route('companyDeliveryMan.delete',$deliveryMan->id) }}" method="POST">
                        @method("DELETE")
                        @csrf
                        <button type="submit" class="btn btn-link">Excluir</button>
                    </form>
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>
    <div class="modal fade" id="deliverymanModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form action="{{ route("companyDeliveryMan.store") }}" method="POST">
                    @csrf
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Adicionar entregador</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="exampleInputEmail1">Email</label>
                            <input type="email" class="form-control" id="exampleInputEmail1" name="email"
                                   aria-describedby="emailHelp" required>
                            <small id="emailHelp" class="form-text text-muted">Digite o e-mail do entregador
                                cadastrado</small>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary">Adicionar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@stop
