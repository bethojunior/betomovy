import os

# 1. Patch CustomerController.php
customer_ctrl_path = r"D:\APLICATIVO MOVY\mobilidade-api-php-master\app\controllers\CustomerController.php"
with open(customer_ctrl_path, 'r', encoding='utf-8') as f:
    cc = f.read()

target_str = """            if ($customer) {
                $result->idCustomer = $customer->getIdCustomer();
                $result->customerId = $customer->getIdCustomer();
            }"""

replacement_str = """            if ($customer) {
                $customerId = is_object($customer) && method_exists($customer, 'getIdCustomer')
                    ? $customer->getIdCustomer()
                    : ($customer->idCustomer ?? $customer->customerId ?? null);
                $result->idCustomer = $customerId;
                $result->customerId = $customerId;
            }"""

if target_str in cc:
    cc = cc.replace(target_str, replacement_str)
elif target_str.replace('\n', '\r\n') in cc:
    cc = cc.replace(target_str.replace('\n', '\r\n'), replacement_str.replace('\n', '\r\n'))
else:
    print("Warning: target_str in CustomerController not found!")

with open(customer_ctrl_path, 'w', encoding='utf-8') as f:
    f.write(cc)
print("CustomerController patched successfully.")

# 2. Patch DriverController.php
driver_ctrl_path = r"D:\APLICATIVO MOVY\mobilidade-api-php-master\app\controllers\DriverController.php"
with open(driver_ctrl_path, 'r', encoding='utf-8') as f:
    dc = f.read()

old_action_register = """    public function actionRegister()
    {
        $object = json_decode($_POST['stdObject']);
        $photos = $_FILES;
        $registerByManager = filter_var($_POST['registerByManager'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $userLoggedManagerId = $_POST['userLoggedManagerId'] ?? null;

        try {
            $this->driverDao->validateRegister($object);
            $persistedPhotos = $this->driverDao->persistRegisterPhotos($photos);

            Queue::dispatch(DriverRegisterJob::class, [
                'data' => $object,
                'photos' => $persistedPhotos,
                'registerByManager' => $registerByManager,
                'userLoggedManagerId' => $userLoggedManagerId,
            ]);

            echo $this->returnSuccess('Success', ['queued' => true]);
        } catch (\\Exception $e) {
            echo $this->returnError($e);
        }
    }"""

new_action_register = """    public function actionRegister()
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
        } catch (\\Exception $e) {
            echo $this->returnError($e);
        }
    }"""

if old_action_register in dc:
    dc = dc.replace(old_action_register, new_action_register)
elif old_action_register.replace('\n', '\r\n') in dc:
    dc = dc.replace(old_action_register.replace('\n', '\r\n'), new_action_register.replace('\n', '\r\n'))
else:
    print("Warning: old_action_register in DriverController not found!")

with open(driver_ctrl_path, 'w', encoding='utf-8') as f:
    f.write(dc)
print("DriverController patched successfully.")
