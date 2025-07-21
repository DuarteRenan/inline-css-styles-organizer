    const orderedProps = [
      "display", "visibility", "overflow", "position", "top", "right", "bottom", "left", "z-index",
      "width", "min-width", "max-width",
      "height", "min-height", "max-height",
      "padding", "padding-top", "padding-right", "padding-bottom", "padding-left",
      "margin", "margin-top", "margin-right", "margin-bottom", "margin-left",
      "border", "border-width", "border-style", "border-color", "border-radius",
      "box-sizing",
      "background", "background-color", "background-image", "background-repeat", "background-position", "background-size",
      "font", "font-family", "font-size", "font-weight", "line-height", "letter-spacing",
      "text-align", "text-decoration", "text-transform", "color", "white-space",
      "opacity", "box-shadow",
      "vertical-align", "border-collapse", "border-spacing",
      "mso-table-lspace", "mso-table-rspace", "mso-padding-alt", "mso-line-height-rule",
      "outline", "-ms-interpolation-mode", "mso-hide"
    ];

    function reorderStyle(styleString) {
      const styleMap = new Map();
      styleString.split(";").forEach((decl) => {
        const [prop, val] = decl.split(":").map((s) => s && s.trim());
        if (prop && val) styleMap.set(prop.toLowerCase(), val);
      });

      const orderedStyle = [];
      for (const prop of orderedProps) {
        if (styleMap.has(prop)) {
          orderedStyle.push(`${prop}: ${styleMap.get(prop)}`);
          styleMap.delete(prop);
        }
      }
      for (const [prop, val] of styleMap.entries()) {
        orderedStyle.push(`${prop}: ${val}`);
      }

      return orderedStyle.join("; ") + ";";
    }

    function ordenarEstilos() {
      const textarea = document.getElementById("htmlInput");
      const html = textarea.value;
      if (!html.trim()) return alert("⚠️ Cole algum HTML no campo para reorganizar.");

      const atualizado = html.replace(/style="([^"]*)"/gi, (_, styleContent) => {
        const novo = reorderStyle(styleContent);
        return `style="${novo}"`;
      });

      textarea.value = atualizado;
      alert("✅ O texto foi reordenado com sucesso!");
    }

    function copiarHTML() {
      const textarea = document.getElementById("htmlInput");
      textarea.select();
      document.execCommand("copy");
      alert("📋 HTML copiado para a área de transferência.");
    }

    function baixarResultado() {
      const content = document.getElementById("htmlInput").value;
      const blob = new Blob([content], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "email-ordenado.html";
      a.click();
      URL.revokeObjectURL(url);
    }

    // Processamento múltiplo de arquivos
    document.getElementById("fileInput").addEventListener("change", function () {
      const container = document.getElementById("downloads");
      container.innerHTML = ""; // Limpa downloads anteriores

      const files = Array.from(this.files);
      if (!files.length) return;

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = function (e) {
          const original = e.target.result;
          const atualizado = original.replace(/style="([^"]*)"/gi, (_, styleContent) => {
            const novo = reorderStyle(styleContent);
            return `style="${novo}"`;
          });

          const blob = new Blob([atualizado], { type: "text/html" });
          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.download = "ordenado_" + file.name;
          link.textContent = "⬇️ Baixar: " + file.name;
          link.className = "block bg-indigo-200 text-indigo-800 px-4 py-2 rounded-md hover:bg-indigo-300 transition";
          container.appendChild(link);
        };
        reader.readAsText(file);
      });
    });
