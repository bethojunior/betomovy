<div class="card">
    <div class="card-header" id="headingTwo">
        <h2 class="mb-0">
            <button class="btn btn-link collapsed" type="button" data-toggle="collapse"
                    data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                Horários de funcionamento
            </button>
        </h2>
    </div>
    <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
        <div class="card-body">
            <form action="{{ route("openHour.save") }}" method="POST">
            @csrf
            <table class="table table-striped">
                <thead>
                <tr>
                    <th>Dia da semana</th>
                    <th>Horário abertura</th>
                    <th>Horário encerramento</th>
                </tr>
                </thead>
                <tbody>
                @foreach($weekDays as $weekDay)
                <tr>
                    <td>
                        <div class="form-group form-check">
                            <input type="checkbox" id="day-{{ $weekDay->id }}" class="form-check-input checked-day-week" {{ $weekDay->hourStart == null ? "" : "checked" }} value="{{ $weekDay->id }}">
                            <label class="form-check-label"
                                   for="day-{{ $weekDay->id }}">{{ $weekDay->description }}</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-group">
                            <input type="time" day="{{ $weekDay->id }}" class="form-control change-date-start" name="day[{{ $weekDay->id }}][hourStart]" value="{{ $weekDay->hourStart }}" {{ $weekDay->hourStart == null ? "readonly" : "required" }} >
                        </div>
                    </td>
                    <td>
                        <div class="form-group">
                            <input type="time" class="form-control"  name="day[{{ $weekDay->id }}][hourStop]" value="{{ $weekDay->hourStop }}" {{ $weekDay->hourStop == null ? "readonly" : "required" }} >
                        </div>
                    </td>
                </tr>
                @endforeach
                </tbody>
            </table>
            <button type="submit" class="btn btn-primary float-right">Atualizar</button>
            </form>
        </div>
    </div>
</div>
