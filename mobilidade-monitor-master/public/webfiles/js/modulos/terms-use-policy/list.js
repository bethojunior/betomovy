const elementProperty = new ElementProperty();

mountList();

function mountList() {
    preload(true);

    TermsUsePolicyController.getTerms().then(resolve => {
        let data = resolve.response;

        let list = "";

        list += data.map(item => {
            return `
                <tr>
                    <td>${item.type === "customer" ? "Cliente" : "Motorista"}</td>
                    <td class="description-terms-table">${item.description}</td>
                    <td><a href="edit/${item.type}" class="btn btn-primary">Editar</a></td>
                </tr>
            `;
        }).join("");

        document.getElementById("mountListTermsUsePolicy").innerHTML = list;
        preload(false);
    });

}

