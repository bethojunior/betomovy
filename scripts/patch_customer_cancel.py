path = 'D:/APLICATIVO MOVY/mobilidade-api-php-master/app/controllers/CustomerController.php'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """            echo $this->returnSuccess("Viagem cancelada",
                (new CustomerDao)->cancelTrip($request->tripReference, $request->dateEnd, $request->userId,
                    $status, $request->scheduledTrip ?? false, $request->cancellationReasonsId ?? null)
            );"""

replacement = """            $result = (new CustomerDao)->cancelTrip(
                $request->tripReference,
                $request->dateEnd ?? date('Y-m-d H:i:s'),
                $request->userId ?? \\app\\utils\\Headers::getUserId() ?? null,
                $status,
                $request->scheduledTrip ?? false,
                $request->cancellationReasonsId ?? null
            );

            // Garantir sincronização completa em tempo real para o app do motorista
            try {
                $tripRow = \\app\\dao\\GenericDao::first("SELECT * FROM trip WHERE tripReference = :ref LIMIT 1", [':ref' => $request->tripReference]);
                if ($tripRow) {
                    $tripCtl = new TripController();
                    $refMethod = new \\ReflectionMethod($tripCtl, 'publishTripCanceled');
                    $refMethod->setAccessible(true);
                    $refMethod->invoke($tripCtl, $request->tripReference, $tripRow, true);
                }
            } catch (\\Throwable $eSync) {
                \\app\\utils\\Logger::error("Erro ao sincronizar cancelamento no CustomerController: " . $eSync->getMessage());
            }

            echo $this->returnSuccess("Viagem cancelada", $result);"""

norm_content = content.replace('\r\n', '\n')
norm_target = target.replace('\r\n', '\n')
if norm_target in norm_content:
    new_content = norm_content.replace(norm_target, replacement)
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(new_content)
    print('SUCCESSFULLY PATCHED CustomerController.php')
else:
    print('TARGET NOT FOUND')
