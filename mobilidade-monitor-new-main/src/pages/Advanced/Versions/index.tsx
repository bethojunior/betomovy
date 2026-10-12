import {
  Container,
  ContentTable,
  ContentPagination,
  ContentButtonAddVersion,
  ContentGraphicsVersions,
  AlertMessage,
} from "./styles";

import { PieChart } from "@mui/x-charts";
import { Table, Pagination, Button } from "antd";

import Preload from "../../../components/Utils/Preload";
import { VersionFormModal } from "../../../components/Advanced/Versions/VersionFormModal";

import { useVersions } from "./useVersions";

export const Versions = () => {
  const {
    canManageVersions,
    listVersions,
    loading,
    setLoading,
    loadingTable,
    showModal,
    setShowModal,
    editingVersion,
    openCreateModal,
    columns,
    currentPage,
    totalPage,
    handlePageChange,
    getAllVersions,
    isExistGraphic,
    listVersionsActivesClientFinal,
    listVersionsActivesDrivers,
    listVersionsActivesDelivery,
    listVersionsActivesMobilityPro,
    switchMessageAlert,
  } = useVersions();

  const clientFinalAlert = switchMessageAlert(listVersionsActivesClientFinal.length);
  const driversAlert = switchMessageAlert(listVersionsActivesDrivers.length);
  const deliveryAlert = switchMessageAlert(listVersionsActivesDelivery.length);
  const mobilityProAlert = switchMessageAlert(listVersionsActivesMobilityPro.length);

  return (
    <Container>
      <Preload visible={loading} />
      {canManageVersions && (
        <ContentButtonAddVersion>
          <Button type="primary" onClick={openCreateModal}>
            Adicionar Versão
          </Button>
        </ContentButtonAddVersion>
      )}
      {canManageVersions && isExistGraphic && (
        <ContentGraphicsVersions>
          {listVersionsActivesClientFinal.length > 0 && (
            <div>
              <h3>CLIENTE FINAL</h3>

              <PieChart
                series={[
                  {
                    arcLabel: (item) => `${item.label}`,
                    data: listVersionsActivesClientFinal,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "gray",
                    },
                  },
                ]}
                width={300}
                height={200}
              />

              <AlertMessage $color={clientFinalAlert?.color}>
                {clientFinalAlert?.message}
              </AlertMessage>
            </div>
          )}

          {listVersionsActivesDrivers.length > 0 && (
            <div>
              <h3>DRIVER</h3>

              <PieChart
                series={[
                  {
                    arcLabel: (item) => `${item.label}`,
                    data: listVersionsActivesDrivers,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "gray",
                    },
                  },
                ]}
                width={300}
                height={200}
              />

              <AlertMessage $color={driversAlert?.color}>
                {driversAlert?.message}
              </AlertMessage>
            </div>
          )}

          {listVersionsActivesDelivery.length > 0 && (
            <div>
              <h3>DELIVERY</h3>

              <PieChart
                series={[
                  {
                    arcLabel: (item) => `${item.label}`,
                    data: listVersionsActivesDelivery,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "gray",
                    },
                  },
                ]}
                width={300}
                height={200}
              />

              <AlertMessage $color={deliveryAlert?.color}>
                {deliveryAlert?.message}
              </AlertMessage>
            </div>
          )}

          {listVersionsActivesMobilityPro.length > 0 && (
            <div>
              <h3>MOBILITY PRO</h3>

              <PieChart
                series={[
                  {
                    arcLabel: (item) => `${item.label}`,
                    data: listVersionsActivesMobilityPro,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "gray",
                    },
                  },
                ]}
                width={300}
                height={200}
              />

              <AlertMessage $color={mobilityProAlert?.color}>
                {mobilityProAlert?.message}
              </AlertMessage>
            </div>
          )}
        </ContentGraphicsVersions>
      )}
      {canManageVersions && (
        <ContentTable>
          <Table
            dataSource={Array.isArray(listVersions) ? listVersions : []}
            columns={columns}
            pagination={false}
            loading={loadingTable}
          />
          <ContentPagination>
            {totalPage && (
              <Pagination
                total={totalPage * 10}
                showSizeChanger={false}
                current={currentPage}
                onChange={handlePageChange}
              />
            )}
          </ContentPagination>
        </ContentTable>
      )}
      {canManageVersions && (
        <VersionFormModal
          mode={editingVersion ? "edit" : "create"}
          initialValues={editingVersion}
          listVersions={listVersions}
          setLoading={setLoading}
          setShowModal={setShowModal}
          showModal={showModal}
          getAllVersions={getAllVersions}
        />
      )}
    </Container>
  );
};
