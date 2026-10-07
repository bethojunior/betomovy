import swal from "sweetalert";

export const convertLinkToBlob = async (link: string) => {
  try {
    const response = await fetch(link);

    if (!response.ok) {
      throw new Error("Falha ao obter o arquivo.");
    }
    const arrayBuffer = await response.arrayBuffer();

    const blob = new Blob([arrayBuffer]);

    return blob;
  } catch (error) {
    console.error(error);
    swal({
      title: "Erro ao converter o link em Blob",
      icon: "error",
    });
    return null;
  }
};
