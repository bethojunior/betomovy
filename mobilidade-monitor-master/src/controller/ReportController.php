<?php


class ReportController extends View
{
    public function actionIndex()
    {
        $this->nameView = "Relatorios";

        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                "report/index"
            ],
            [
                "controllers/ReportController",
                "modulos/report/index"
            ],
            [
                "report/index"
            ]);
    }

    public function actionReportNew()
    {
        $this->nameView = "Relatórios";

        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                "reportNew/index"
            ],
            [
                "controllers/ReportNewController",
                "modulos/reportNew/index"
            ],
            [
                "reportNew/index"
            ]);
    }

    public function actionReportList()
    {
        $this->nameView = "Listagem de relatórios";

        $this->setTemplate(Template::defaultView());

        $this->layoutBuilder(
            [
                "reportList/index"
            ],
            [
                "controllers/ReportNewController",
                "modulos/reportList/index"
            ],
            [
                "reportList/index"
            ]);
    }

    public function actionCreateTemp()
    {
        $file = $_FILES;

        try {
            if (!is_dir('temp'))
                if (!mkdir('temp'))
                    throw new Exception("Erro ao criar pasta temporária, tente verificar as permissões");

            if (!isset($file['file']))
                throw new Exception("Arquivo não foi enviado");

            if(!copy($file['file']['tmp_name'], 'temp/tempFile.xlsx'))
                throw new Exception("Não foi possível salvar o arquivo");

            return $this->returnAjaxResponse(true, true, "Sucesso");

        } catch (Exception $e) {
            return $this->returnAjaxResponse(false, null, $e->getMessage());
        }
    }

    /**
     * @param bool $status
     * @param $data
     * @param string $message
     */
    private function returnAjaxResponse(bool $status, $data = null, $message = '')
    {
        header('Content-Type: application/json');
        echo json_encode([
            'status' => $status,
            'data' => $data,
            'message' => $message
        ]);

        return null;
    }
}