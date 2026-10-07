<!DOCTYPE html>
<html>
<head>
    <title>Relatório</title>
    <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
    <style type="text/css">
        /* #printable{ display: none;} */
        * {
            margin: 0;
            padding: 0;
        }
        body {
            margin: 10px;
        }
        div#printable {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        div#printable div.title-head {
            display: flex;
            /* justify-content: space-between; */
            align-items: center;
            text-align: center;
            /* border-bottom: 1px solid #ccc; */
            padding-bottom: 10px;
            margin-bottom: 10px;
        }
        div#printable div.title-head img {
            width: 80px;
            height: 80px;
        }
        div#printable h2 {
            font-weight: 600;
            margin: 12px 25px;
            text-transform: uppercase;
        }
        div#printable p.detalhes {
            margin: 0;
            padding: 0;
            line-height: 15px;
        }
        div#printable p.detalhes span {
            text-transform: uppercase;
            font-size: 10px;
        }
        table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
            margin-top: 20vh;
            borderWidth: 'thin';
            margin-bottom: 15px;
            font-size: 10px;
        }
        table span {
            border:none;
            borderWidth: 'thin',

        }
        fieldset {
            position: absolute;
            padding: 8px;
            right:1.6cm;
            width: 4cm;
            top: 7%;
            border: 1px solid #000;
        }
        fieldset legend {
            text-align: center;
            padding: 2px;
            font-weight: 600;
        }
        .left{ text-align: left;}
        .rigth { text-align:  right;}
        .numberReal{
            display: flex;
            /* border: none;  */
            /* border-bottom: 1px soli */
            justify-content: space-between;
        }
        td, th {
            border: 1px solid #000;

            text-align: left;
            padding: 2px;
        }
        tr:nth-child(even) {
            background-color: #dddddd;
        }
        /* Print */
        @media print {
            /* @page { margin: 0; } */
            @page{
                size: auto;
                margin-bottom: 1.8cm;
            }
            body {
                margin: 1.6cm;
            }

        }
    </style>
</head>
<body>
    @empty($data)
        <div>
            <p id="titulo"><b>Nenhum dado foi gerado</b></p>
        </div>
    @else
        <div id="printable">
            <table id="tabela">
                <thead>
                <tr>
                    @foreach(array_keys($data[0]) as $attribute)
                        <th class="celula_head">{{ $attribute }}</th>
                    @endforeach
                </tr>
                </thead>
                <tbody>
                @foreach($data as $value)
                    <tr>
        {{--                <td class="celula_center">{{COD}}</td>--}}
                        @foreach(array_keys($data[0]) as $attribute)
                            <td class="celula">{{ $value[$attribute] }}</td>
                        @endforeach
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>
        @endempty
</body>
</html>
