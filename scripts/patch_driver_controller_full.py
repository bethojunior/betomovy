import os

driver_ctrl_path = r"D:\APLICATIVO MOVY\mobilidade-api-php-master\app\controllers\DriverController.php"
with open(driver_ctrl_path, 'r', encoding='utf-8') as f:
    dc = f.read()

target = """    public function actionRegister()
    {
        $rawStd = $_POST['stdObject'] ?? null;
        if ($rawStd) {
            $object = is_string($rawStd) ? json_decode($rawStd) : (object)$rawStd;
        } else {
            $object = $this->request();
        }

        if ($object) {
            if (isset($object->user) && !isset($object->driver)) {
                $object->driver = $object->user;
            }
            if (isset($object->vehicle) && !isset($object->car)) {
                $object->car = $object->vehicle;
            }
            if (isset($object->car)) {
                if (empty($object->car->brand) && !empty($object->car->model)) {
                    $parts = explode(' ', trim($object->car->model));
                    $object->car->brand = $parts[0];
                }
            }
            if (isset($object->driver)) {
                if (empty($object->driver->cityId)) {
                    $object->driver->cityId = 1;
                }
            }
        }

        $photos = $_FILES ?? [];
        $registerByManager = filter_var($_POST['registerByManager'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $userLoggedManagerId = $_POST['userLoggedManagerId'] ?? null;

        try {
            $this->driverDao->validateRegister($object);
            $result = $this->driverDao->register($object, $photos, $registerByManager, $userLoggedManagerId);
            echo $this->returnSuccess('Motorista cadastrado com sucesso', $result);
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }"""

replacement = """    public function actionRegister()
    {
        $rawStd = $_POST['stdObject'] ?? null;
        if ($rawStd) {
            $object = is_string($rawStd) ? json_decode($rawStd) : (object)$rawStd;
        } else {
            $object = $this->request();
        }

        if ($object) {
            if (isset($object->user) && !isset($object->driver)) {
                $object->driver = $object->user;
            }
            if (isset($object->vehicle) && !isset($object->car)) {
                $object->car = $object->vehicle;
            }
            if (isset($object->car)) {
                if (empty($object->car->brand) && !empty($object->car->model)) {
                    $parts = explode(' ', trim($object->car->model));
                    $object->car->brand = $parts[0];
                }
                if (empty($object->car->model)) {
                    $object->car->model = 'Standard';
                }
                if (empty($object->car->color)) {
                    $object->car->color = 'Black';
                }
                if (empty($object->car->year)) {
                    $object->car->year = date('Y');
                }
                if (empty($object->car->licensePlate)) {
                    $object->car->licensePlate = 'MOV' . rand(1000, 9999);
                }
            }
            if (isset($object->driver)) {
                if (empty($object->driver->cityId) || $object->driver->cityId == 1) {
                    $object->driver->cityId = 5605;
                }
                if (empty($object->driver->docs)) {
                    $object->driver->docs = [
                        (object)['docId' => 1, 'text' => "Driver's License"],
                        (object)['docId' => 2, 'text' => "Vehicle insurance and registration"],
                        (object)['docId' => 6, 'text' => "Proof of residence"],
                        (object)['docId' => 10, 'text' => "SCN"],
                    ];
                }
            }
        }

        $photos = $_FILES ?? [];
        if (isset($photos['DOC_1']) && !isset($photos['CNH'])) {
            $photos['CNH'] = $photos['DOC_1'];
        }
        if (isset($photos['DOC_2']) && !isset($photos['CRLV'])) {
            $photos['CRLV'] = $photos['DOC_2'];
        }
        if (isset($photos['DOC_4']) && !isset($photos['DOC_6'])) {
            $photos['DOC_6'] = $photos['DOC_4'];
        }
        if (isset($photos['DOC_3']) && !isset($photos['DOC_10'])) {
            $photos['DOC_10'] = $photos['DOC_3'];
        }

        $registerByManager = filter_var($_POST['registerByManager'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $userLoggedManagerId = $_POST['userLoggedManagerId'] ?? null;

        try {
            $this->driverDao->validateRegister($object);
            $result = $this->driverDao->register($object, $photos, $registerByManager, $userLoggedManagerId);
            echo $this->returnSuccess('Motorista cadastrado com sucesso', $result);
        } catch (\Exception $e) {
            echo $this->returnError($e);
        }
    }"""

if target in dc:
    dc = dc.replace(target, replacement)
    print("Patched with LF")
elif target.replace('\n', '\r\n') in dc:
    dc = dc.replace(target.replace('\n', '\r\n'), replacement.replace('\n', '\r\n'))
    print("Patched with CRLF")
else:
    print("Warning: target not found!")

with open(driver_ctrl_path, 'w', encoding='utf-8') as f:
    f.write(dc)
print("Saved DriverController.php")
