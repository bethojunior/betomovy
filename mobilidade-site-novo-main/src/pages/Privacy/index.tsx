import { useEffect, useMemo } from "react";
import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";
import { Container } from "./styles";
import { getNameApplication } from "../../config/configApp";
import { policyHtml } from "./policyHtml";

const DOMPURIFY_CONFIG = { ADD_ATTR: ["style"] };

const Privacy = () => {
  const { t, i18n } = useTranslation();
  const appNameUpper = getNameApplication().toUpperCase();
  const htmlContent = useMemo(() => {
    const htmlWithAppName = policyHtml.replace(
      /\{\{APP\}\}/g,
      `<strong>${appNameUpper}</strong>`
    );
    return DOMPurify.sanitize(htmlWithAppName, DOMPURIFY_CONFIG);
  }, [appNameUpper]);

  useEffect(() => {
    document.title = t("privacy-page-title");
  }, [t, i18n.language]);

  return (
    <Container>
      <article
        className="content-policy"
        dir={i18n.dir()}
        lang={i18n.language}
        aria-label={t("privacy-aria-label")}
      >
        <div
          className="content-policy-body"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </Container>
  );
};

export default Privacy;
