import * as yup from "yup";

import { WebhooksServicesProps } from "../../../../../pages/Advanced/Configs/ServicesExternalWebhook/types";
import { schemaWebhook } from "./schema";

export interface ModalAddRouteWebhookProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  dataWebhook: WebhooksServicesProps | null;
  setDataWebhook: (data: WebhooksServicesProps | null) => void;
  getAllWebhooks: () => void;
}

export type SchemaWebookProps = yup.InferType<typeof schemaWebhook>;
