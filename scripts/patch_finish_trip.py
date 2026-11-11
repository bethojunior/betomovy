from pathlib import Path

path = Path(r"D:\APLICATIVO MOVY\mobilidade-api-php-master\app\dao\DriverDao.php")
text = path.read_text(encoding="utf-8")

start = text.find('            $logMessage = "MOTORISTA FINALIZOU A VIAGEM ";')
end = text.find("            return $trip;\n        } catch (Exception $e) {\n            if ($needsRollback === true) {\n                $this->rollback();\n            }\n            (new LogDao())->logException($e);\n            throw $e;\n        }\n    }\n\n    public function cleanupFinishedTripRealtime")

if start < 0 or end < 0:
    raise SystemExit(f"markers not found start={start} end={end}")

replacement = '''            /**
             * Atributo necessário para front-end
             */
            $trip->ecoInfo = null;

            $tripCustomerUserId = (new TripCustomerUserService())->resolveUserId($trip);

            $this->commit();
            $needsRollback = false;

            // Redis sem timeout + Firebase + Queue travavam FinishTrip ~90s+.
            // Pós-processamento só em background para o app receber resposta imediata.
            $consolePath = realpath(__DIR__ . '/../../console') ?: '/var/www/html/console';
            $tripRefEsc = escapeshellarg((string)$tripReference);
            $driverIdEsc = escapeshellarg((string)$trip->driverId);
            $userIdEsc = escapeshellarg((string)$tripCustomerUserId);
            exec("cd {$consolePath} && nohup /usr/bin/php command.php cleanup-finished-trip-realtime {$tripRefEsc} > /dev/null 2>&1 & echo $!");
            exec("cd {$consolePath} && nohup /usr/bin/php command.php update-quantity-trips {$userIdEsc} {$driverIdEsc} > /dev/null 2>&1 & echo $!");
            exec("cd {$consolePath} && nohup /usr/bin/php command.php save-route-tracing {$tripRefEsc} > /dev/null 2>&1 & echo $!");
            exec("cd {$consolePath} && nohup /usr/bin/php command.php avg-finished-trip {$tripRefEsc} > /dev/null 2>&1 & echo $!");

            return $trip;
'''

path.write_text(text[:start] + replacement + text[end:], encoding="utf-8")
print("patched", start, end)
