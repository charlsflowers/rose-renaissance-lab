// Order Printer Pro Liquid template for Charls Flowers workshop invoice.
// Kept verbatim from the user-provided Shopify Order Printer Pro template.
export const INVOICE_TEMPLATE = String.raw`<style>
  * { letter-spacing: normal !important; word-spacing: normal !important; font-variant-numeric: normal !important; font-feature-settings: normal !important; text-align: inherit; }
  body { font-family: Arial, "Helvetica Neue", Helvetica, sans-serif, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji"; color: #1a1a1a; margin: 0; padding: 12px; text-align: left; letter-spacing: normal; word-spacing: normal; }
  p, span, td, th, div, strong { color: #1a1a1a; letter-spacing: normal; word-spacing: normal; }
  h4 { color: #1a1a1a; }
  .header { text-align: center; margin-bottom: 14px; }
  .header img { max-width: 140px; }
  hr { border: 1px solid #333; margin: 8px 0; }
  .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
  .info-block { flex: 1; }
  .info-block h4 { margin: 0 0 3px; font-size: 10px; text-transform: uppercase; }
  .info-block p { margin: 0; font-size: 11px; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; table-layout: auto; }
  thead tr { border-bottom: 2px solid #333; }
  th { text-align: left; padding: 5px 4px; font-size: 10px; text-transform: uppercase; }
  th:last-child { text-align: right; width: 70px; }
  td { padding: 8px 4px; vertical-align: middle; border-bottom: 1px solid #eee; }
  .td-img { width: auto; }
  .bouquet-img { width: 300px; height: 300px; object-fit: cover; display: block; }
  .accessory-img { width: 70px; height: 70px; object-fit: cover; display: block; }
  .td-desc { vertical-align: middle; padding-left: 10px; }
  .td-price { vertical-align: middle; text-align: right; white-space: nowrap; width: 70px; }
  .total-row { text-align: right; margin-top: 12px; font-size: 13px; font-weight: bold; }
  .card-text-content { white-space: pre-wrap; font-style: italic; text-align: left; }
  .cliente-nota-box { margin: 12px 0; font-size: 11px; }
  .cliente-nota-box h4 { font-size: 11px; text-transform: uppercase; margin-bottom: 4px; color: #8B1A3A; }
  .fin-grupo td { border-bottom: 2px solid #333; }
  table, thead, tbody { page-break-inside: auto; break-inside: auto; }
  tr { page-break-inside: avoid; break-inside: avoid; }
  .card-text-content, .cliente-nota-box, .cliente-nota-box p { page-break-inside: avoid; break-inside: avoid; }
</style>
<div class="header">
  <img src="https://cdn.shopify.com/s/files/1/0979/1671/5140/files/Captura_de_pantalla_2026-02-28_a_las_23.17.37-removebg-preview.png?v=1773451847" alt="Charl's Flowers">
</div>
<hr>
{% assign es_home_delivery = false %}
{% assign hora = "" %}
{% assign fecha_entrega = "" %}
{% assign tipo_entrega = "" %}
{% assign crown_color = "" %}
{% assign glitter_text = "" %}
{% assign baby_breath_text = "" %}
{% assign custom_ribbon_text = "" %}
{% assign personalized_ribbon_text = "" %}
{% for attribute in order.attributes %}
  {% if attribute.name == "delivery_time" or attribute.name == "Delivery time" %}{% assign hora = attribute.value %}{% endif %}
  {% if attribute.name == "delivery_date" or attribute.name == "Delivery date" %}{% assign fecha_entrega = attribute.value %}{% endif %}
  {% if attribute.name == "delivery_type" or attribute.name == "Delivery type" %}{% assign tipo_entrega = attribute.value %}{% endif %}
{% endfor %}
{% if order.note != blank %}
  {% assign note_lines = order.note | split: "
" %}
  {% for line in note_lines %}
    {% assign line_clean = line | strip %}
    {% if line_clean contains "Tipo:" %}{% if tipo_entrega == "" %}{% assign tipo_entrega = line_clean | split: ": " | last | strip %}{% endif %}{% endif %}
    {% if line_clean contains "Fecha:" %}{% if fecha_entrega == "" %}{% assign fecha_entrega = line_clean | split: ": " | last | strip %}{% endif %}{% endif %}
    {% if line_clean contains "Hora:" %}{% if hora == "" %}{% assign hora = line_clean | split: ": " | last | strip %}{% endif %}{% endif %}
    {% if line_clean contains "Glitter finish:" %}
      {% assign glitter_val = line_clean | split: "Glitter finish:" | last | strip | downcase %}
      {% if glitter_val == "yes" %}{% assign glitter_text = "Yes" %}{% endif %}
    {% endif %}
    {% if line_clean contains "Letters or numbers (Baby Breath):" %}{% assign baby_breath_text = line_clean | split: "Letters or numbers (Baby Breath):" | last | strip %}{% endif %}
    {% if line_clean contains "Custom ribbon:" %}{% assign custom_ribbon_text = line_clean | split: "Custom ribbon:" | last | strip %}{% endif %}
    {% if line_clean contains "Personalized ribbon:" %}{% assign personalized_ribbon_text = line_clean | split: "Personalized ribbon:" | last | strip %}{% endif %}
  {% endfor %}
{% endif %}
{% for line_item in order.line_items %}
  {% assign titulo_li = line_item.product.title | downcase %}
  {% if titulo_li == "crown" %}
    {% if line_item.variant_title != blank and line_item.variant_title != "Default Title" %}{% assign crown_color = line_item.variant_title %}{% endif %}
  {% endif %}
{% endfor %}
{% if tipo_entrega contains "Home" or tipo_entrega contains "home" or tipo_entrega contains "Delivery" %}{% assign es_home_delivery = true %}{% endif %}
{% assign prod_blocks = order.note | split: "DATOS DEL PRODUCTO" %}
{% assign pintados = "black,green,blue" | split: "," %}
{% assign notes_img = "" %}
{% assign notes_price = "" %}
{% assign home_delivery_price = "" %}
{% for li in order.line_items %}
  {% assign lt = li.product.title | downcase %}
  {% if lt == "notes" or lt == "cards" %}
    {% if li.product.featured_image %}{% assign notes_img = li.product.featured_image | img_url: '200x200' %}{% endif %}
    {% assign notes_price = li.original_price | money %}
  {% endif %}
  {% if lt contains "home delivery" %}
    {% assign home_delivery_price = li.original_line_price | money %}
  {% endif %}
{% endfor %}
<div class="info-row">
  <div class="info-block">
    <h4>N Factura</h4>
    <p>{{ order.order_number }}</p>
    <h4 style="margin-top:6px;">Fecha de entrega</h4>
    <p>
      {% if fecha_entrega != "" %}{{ fecha_entrega }}{% else %}{{ order.created_at | date: "%d/%m/%Y" }}{% endif %}
      {% if hora != "" %}&nbsp;·&nbsp;{{ hora }}{% endif %}
    </p>
    {% if es_home_delivery %}
      <h4 style="margin-top:6px;">Direccion de entrega</h4>
      <p>{{ order.shipping_address.address1 }}{% if order.shipping_address.address2 != blank %}, {{ order.shipping_address.address2 }}{% endif %}, {{ order.shipping_address.city }} {{ order.shipping_address.zip }}</p>
    {% endif %}
  </div>
  <div class="info-block" style="text-align:center;">
    <h4>Tipo de envio</h4>
    <p><strong>
      {% if tipo_entrega != "" %}{{ tipo_entrega }}
      {% elsif es_home_delivery %}Home Delivery
      {% else %}Store Pickup{% endif %}
    </strong></p>
    {% if home_delivery_price != "" %}<p>{{ home_delivery_price }}</p>{% endif %}
  </div>
  <div class="info-block" style="text-align:right;">
    <h4>Datos del cliente</h4>
    {% assign cli_nombre = "" %}
    {% if order.customer %}{% assign cli_nombre = order.customer.first_name | append: " " | append: order.customer.last_name | strip %}{% endif %}
    {% if cli_nombre == "" %}{% assign cli_nombre = order.billing_address.name | strip %}{% endif %}
    {% if cli_nombre == "" %}{% assign cli_nombre = order.shipping_address.name | strip %}{% endif %}
    {% if cli_nombre != "" %}<p><strong>{{ cli_nombre }}</strong></p>{% endif %}
    {% assign cli_email = order.email %}
    {% if cli_email == blank and order.customer %}{% assign cli_email = order.customer.email %}{% endif %}
    {% if cli_email != blank %}<p>{{ cli_email }}</p>{% endif %}
    {% assign tel_cliente = order.billing_address.phone %}
    {% if tel_cliente == blank %}{% assign tel_cliente = order.shipping_address.phone %}{% endif %}
    {% if tel_cliente == blank %}{% assign tel_cliente = order.phone %}{% endif %}
    {% if tel_cliente == blank and order.customer %}{% assign tel_cliente = order.customer.phone %}{% endif %}
    {% if tel_cliente != blank %}<p>📞 {{ tel_cliente }}</p>{% endif %}
  </div>
</div>
<hr>
<table>
  <thead>
    <tr>
      <th class="td-img">Producto</th>
      <th>Descripcion</th>
      <th style="text-align:right; width:70px;">Importe</th>
    </tr>
  </thead>
  <tbody>
    {% for line_item in order.line_items %}
      {% assign titulo = line_item.product.title | downcase %}
      {% if titulo contains "service fee" or titulo contains "shipping protection" or titulo contains "protection" or titulo contains "home delivery" %}{% continue %}{% endif %}
      {% if titulo == "notes" or titulo == "cards" %}{% continue %}{% endif %}
      {% assign es_custom = false %}
      {% if titulo contains "custom bouquet" %}{% assign es_custom = true %}{% endif %}
      {% assign es_bouquet = true %}
      {% if titulo contains "service fee" %}{% assign es_bouquet = false %}{% endif %}
      {% if titulo contains "home delivery" %}{% assign es_bouquet = false %}{% endif %}
      {% if titulo contains "crown" %}{% assign es_bouquet = false %}{% endif %}
      {% if titulo contains "glitter" %}{% assign es_bouquet = false %}{% endif %}
      {% if titulo contains "butterflies" %}{% assign es_bouquet = false %}{% endif %}
      {% if titulo contains "ribbon" %}{% assign es_bouquet = false %}{% endif %}
      {% if titulo contains "letters" %}{% assign es_bouquet = false %}{% endif %}
      {% if titulo contains "baby breath" %}{% assign es_bouquet = false %}{% endif %}
      {% if titulo contains "vase" %}{% assign es_bouquet = false %}{% endif %}
      {% assign b_c1 = "" %}{% assign b_c2 = "" %}{% assign b_c3 = "" %}
      {% assign b_paper = "" %}{% assign b_roses = "" %}{% assign b_color_cat = "" %}{% assign b_card = "" %}
      {% if es_bouquet or es_custom %}
        {% assign blk = "" %}
        {% assign search = "Producto: " | append: line_item.product.title %}
        {% for pb in prod_blocks %}{% if pb contains search %}{% assign blk = pb %}{% endif %}{% endfor %}
        {% assign blk_lines = blk | split: "
" %}
        {% for bl in blk_lines %}
          {% assign blc = bl | strip %}
          {% if blc contains "Colour 1:" %}{% assign b_c1 = blc | split: "Colour 1:" | last | strip %}{% endif %}
          {% if blc contains "Colour 2:" %}{% assign b_c2 = blc | split: "Colour 2:" | last | strip %}{% endif %}
          {% if blc contains "Colour 3:" %}{% assign b_c3 = blc | split: "Colour 3:" | last | strip %}{% endif %}
          {% if blc contains "Paper color:" %}{% assign b_paper = blc | split: "Paper color:" | last | strip %}{% endif %}
          {% if blc contains "Roses:" %}{% assign b_roses = blc | split: "Roses:" | last | strip %}{% endif %}
          {% if blc contains "Color:" %}{% assign b_color_cat = blc | split: "Color:" | last | strip %}{% endif %}
        {% endfor %}
        {% assign b_roses_num = b_roses | remove: " " | plus: 0 %}
        {% if blk contains "Card text:" %}
          {% assign b_card = blk | split: "Card text:" | last %}
          {% assign b_card = b_card | split: "
- 🎀" | first %}
          {% assign b_card = b_card | split: "
NOTAS DEL CLIENTE" | first %}
          {% assign b_card = b_card | strip %}
        {% endif %}
      {% endif %}
      <tr>
        <td class="td-img">
          {% if es_custom %}
            <img class="bouquet-img" src="https://cdn.shopify.com/s/files/1/0979/1671/5140/files/CUSTOMIZE_BOUQUET.png?v=1776545215">
          {% elsif line_item.product.featured_image %}
            {% if es_bouquet %}
              <img class="bouquet-img" src="{{ line_item.product.featured_image | img_url: '600x600' }}">
            {% else %}
              <img class="accessory-img" src="{{ line_item.product.featured_image | img_url: '200x200' }}">
            {% endif %}
          {% endif %}
        </td>
        <td class="td-desc">
          {% unless titulo contains "ribbon" %}<strong>{{ line_item.product.title }}</strong><br>{% endunless %}
          {% if es_custom %}
            {% if b_c1 != "" %}<span>🌸 Colour 1: {{ b_c1 }}</span><br>{% endif %}
            {% if b_c2 != "" %}<span>🌸 Colour 2: {{ b_c2 }}</span><br>{% endif %}
            {% if b_c3 != "" %}<span>🌸 Colour 3: {{ b_c3 }}</span><br>{% endif %}
            <br><strong style="font-size:10px; color:#8B1A3A; text-transform:uppercase;">Detalles del bouquet</strong><br>
            {% if b_paper != "" %}<span>📄 Paper color: {{ b_paper }}</span><br>{% endif %}
            {% if b_roses != "" %}<span>Cantidad de rosas: {{ b_roses }}</span><br>{% endif %}
            <br><strong style="font-size:10px; color:#8B1A3A; text-transform:uppercase;">Detalles de preparación</strong><br>
            {% assign lc1 = b_c1 | downcase | strip %}{% assign lc2 = b_c2 | downcase | strip %}{% assign lc3 = b_c3 | downcase | strip %}
            {% assign tt1 = "" %}{% assign tt2 = "" %}{% assign tt3 = "" %}
            {% if b_c1 != "" %}{% if lc1 == "red" %}{% assign tt1 = "rojo" %}{% elsif pintados contains lc1 %}{% assign tt1 = "pintado" %}{% else %}{% assign tt1 = "natural" %}{% endif %}{% endif %}
            {% if b_c2 != "" %}{% if lc2 == "red" %}{% assign tt2 = "rojo" %}{% elsif pintados contains lc2 %}{% assign tt2 = "pintado" %}{% else %}{% assign tt2 = "natural" %}{% endif %}{% endif %}
            {% if b_c3 != "" %}{% if lc3 == "red" %}{% assign tt3 = "rojo" %}{% elsif pintados contains lc3 %}{% assign tt3 = "pintado" %}{% else %}{% assign tt3 = "natural" %}{% endif %}{% endif %}
            {% assign nN = 0 %}{% assign nP = 0 %}{% assign nR = 0 %}
            {% if tt1 == "natural" %}{% assign nN = nN | plus: 1 %}{% endif %}{% if tt2 == "natural" %}{% assign nN = nN | plus: 1 %}{% endif %}{% if tt3 == "natural" %}{% assign nN = nN | plus: 1 %}{% endif %}
            {% if tt1 == "pintado" %}{% assign nP = nP | plus: 1 %}{% endif %}{% if tt2 == "pintado" %}{% assign nP = nP | plus: 1 %}{% endif %}{% if tt3 == "pintado" %}{% assign nP = nP | plus: 1 %}{% endif %}
            {% if tt1 == "rojo" %}{% assign nR = nR | plus: 1 %}{% endif %}{% if tt2 == "rojo" %}{% assign nR = nR | plus: 1 %}{% endif %}{% if tt3 == "rojo" %}{% assign nR = nR | plus: 1 %}{% endif %}
            {% assign nTot = nN | plus: nP | plus: nR %}
            {% assign ostr = "" %}
            {% if tt1 == "natural" %}{% assign ostr = ostr | append: b_c1 | append: "~" %}{% endif %}{% if tt2 == "natural" %}{% assign ostr = ostr | append: b_c2 | append: "~" %}{% endif %}{% if tt3 == "natural" %}{% assign ostr = ostr | append: b_c3 | append: "~" %}{% endif %}
            {% if tt1 == "pintado" %}{% assign ostr = ostr | append: b_c1 | append: "~" %}{% endif %}{% if tt2 == "pintado" %}{% assign ostr = ostr | append: b_c2 | append: "~" %}{% endif %}{% if tt3 == "pintado" %}{% assign ostr = ostr | append: b_c3 | append: "~" %}{% endif %}
            {% if tt1 == "rojo" %}{% assign ostr = ostr | append: b_c1 | append: "~" %}{% endif %}{% if tt2 == "rojo" %}{% assign ostr = ostr | append: b_c2 | append: "~" %}{% endif %}{% if tt3 == "rojo" %}{% assign ostr = ostr | append: b_c3 | append: "~" %}{% endif %}
            {% assign ocb = ostr | split: "~" %}
            {% assign cmb = "" %}
            {% if nN == 3 %}{% assign cmb = "EVEN" %}{% endif %}{% if nP == 3 %}{% assign cmb = "EVEN" %}{% endif %}
            {% if nN == 2 and nR == 1 %}{% assign cmb = "EVEN" %}{% endif %}{% if nN == 2 and nP == 1 %}{% assign cmb = "EVEN" %}{% endif %}
            {% if nN == 1 and nP == 1 and nR == 1 %}{% assign cmb = "NPR" %}{% endif %}
            {% if nN == 1 and nP == 2 %}{% assign cmb = "PPN" %}{% endif %}
            {% if nP == 2 and nR == 1 %}{% assign cmb = "PPR" %}{% endif %}
            {% assign x1 = 0 %}{% assign x2 = 0 %}{% assign x3 = 0 %}
            {% if cmb == "EVEN" %}
              {% if b_roses_num == 75 %}{% assign x1 = 25 %}{% assign x2 = 25 %}{% assign x3 = 25 %}{% endif %}
              {% if b_roses_num == 100 %}{% assign x1 = 50 %}{% assign x2 = 25 %}{% assign x3 = 25 %}{% endif %}
              {% if b_roses_num == 125 %}{% assign x1 = 50 %}{% assign x2 = 50 %}{% assign x3 = 25 %}{% endif %}
              {% if b_roses_num == 150 %}{% assign x1 = 50 %}{% assign x2 = 50 %}{% assign x3 = 50 %}{% endif %}
              {% if b_roses_num == 175 %}{% assign x1 = 75 %}{% assign x2 = 50 %}{% assign x3 = 50 %}{% endif %}
              {% if b_roses_num == 200 %}{% assign x1 = 75 %}{% assign x2 = 75 %}{% assign x3 = 50 %}{% endif %}
            {% endif %}
            {% if cmb == "NPR" %}
              {% if b_roses_num == 75 %}{% assign x1 = 25 %}{% assign x2 = 25 %}{% assign x3 = 25 %}{% endif %}
              {% if b_roses_num == 100 %}{% assign x1 = 50 %}{% assign x2 = 25 %}{% assign x3 = 25 %}{% endif %}
              {% if b_roses_num == 125 %}{% assign x1 = 75 %}{% assign x2 = 25 %}{% assign x3 = 25 %}{% endif %}
              {% if b_roses_num == 150 %}{% assign x1 = 75 %}{% assign x2 = 25 %}{% assign x3 = 50 %}{% endif %}
              {% if b_roses_num == 175 %}{% assign x1 = 100 %}{% assign x2 = 25 %}{% assign x3 = 50 %}{% endif %}
              {% if b_roses_num == 200 %}{% assign x1 = 100 %}{% assign x2 = 50 %}{% assign x3 = 50 %}{% endif %}
            {% endif %}
            {% if cmb == "PPN" %}
              {% if b_roses_num == 75 %}{% assign x1 = 25 %}{% assign x2 = 25 %}{% assign x3 = 25 %}{% endif %}
              {% if b_roses_num == 100 %}{% assign x1 = 50 %}{% assign x2 = 25 %}{% assign x3 = 25 %}{% endif %}
              {% if b_roses_num == 125 %}{% assign x1 = 75 %}{% assign x2 = 25 %}{% assign x3 = 25 %}{% endif %}
              {% if b_roses_num == 150 %}{% assign x1 = 100 %}{% assign x2 = 25 %}{% assign x3 = 25 %}{% endif %}
              {% if b_roses_num == 175 %}{% assign x1 = 100 %}{% assign x2 = 50 %}{% assign x3 = 25 %}{% endif %}
              {% if b_roses_num == 200 %}{% assign x1 = 100 %}{% assign x2 = 50 %}{% assign x3 = 50 %}{% endif %}
            {% endif %}
            {% if cmb == "PPR" %}
              {% if b_roses_num == 75 %}{% assign x1 = 25 %}{% assign x2 = 25 %}{% assign x3 = 25 %}{% endif %}
              {% if b_roses_num == 100 %}{% assign x1 = 25 %}{% assign x2 = 25 %}{% assign x3 = 50 %}{% endif %}
              {% if b_roses_num == 125 %}{% assign x1 = 25 %}{% assign x2 = 25 %}{% assign x3 = 75 %}{% endif %}
              {% if b_roses_num == 150 %}{% assign x1 = 25 %}{% assign x2 = 25 %}{% assign x3 = 100 %}{% endif %}
              {% if b_roses_num == 175 %}{% assign x1 = 50 %}{% assign x2 = 50 %}{% assign x3 = 75 %}{% endif %}
              {% if b_roses_num == 200 %}{% assign x1 = 50 %}{% assign x2 = 50 %}{% assign x3 = 100 %}{% endif %}
            {% endif %}
            {% if nTot == 1 %}
              <span>{{ b_roses_num }} rosas {{ ocb[0] }}</span><br>
            {% elsif nTot == 2 %}
              {% assign h2 = b_roses_num | divided_by: 2 | floor %}{% assign h1 = b_roses_num | minus: h2 %}
              <span>{{ h1 }} rosas {{ ocb[0] }}</span><br>
              <span>{{ h2 }} rosas {{ ocb[1] }}</span><br>
            {% elsif nTot == 3 %}
              <span>{{ x1 }} rosas {{ ocb[0] }}</span><br>
              <span>{{ x2 }} rosas {{ ocb[1] }}</span><br>
              <span>{{ x3 }} rosas {{ ocb[2] }}</span><br>
            {% else %}
              <span style="color:#999;">—</span><br>
            {% endif %}
          {% elsif es_bouquet %}
            <br><strong style="font-size:10px; color:#8B1A3A; text-transform:uppercase;">Detalles del bouquet</strong><br>
            {% if b_color_cat != "" %}<span>🌸 Color: {{ b_color_cat }}</span><br>{% endif %}
            {% if b_paper != "" %}<span>📄 Paper color: {{ b_paper }}</span><br>{% endif %}
            {% if b_roses != "" %}<span>Cantidad de rosas: {{ b_roses }}</span><br>{% endif %}
            <br><strong style="font-size:10px; color:#8B1A3A; text-transform:uppercase;">Detalles de preparación</strong><br>
            {% assign prep_match = "" %}
            {% assign mf = line_item.product.metafields.custom.preparation_recipe %}
            {% if mf != blank %}
              {% if mf contains "rosas" or mf contains "roses" %}
                {% assign rlines = mf | split: "
" %}
                {% for rl in rlines %}
                  {% assign rlc = rl | strip %}
                  {% unless rlc == "" %}
                    {% assign rln = rlc | split: ":" | first | remove: "rosas" | remove: "roses" | strip | plus: 0 %}
                    {% if rln == b_roses_num %}{% assign prep_match = rlc | split: ":" | last | strip %}{% endif %}
                  {% endunless %}
                {% endfor %}
              {% else %}
                {% assign prep_match = mf | strip %}
              {% endif %}
            {% endif %}
            {% if prep_match != "" %}
              {% assign pparts = prep_match | split: " + " %}
              {% for part in pparts %}
                {% assign pf = part | split: " " | first %}
                {% assign pn = pf | plus: 0 %}
                {% if pn > 0 %}<span>{{ pf }} rosas {{ part | remove_first: pf | strip }}</span><br>
                {% else %}<span>{{ part }}</span><br>{% endif %}
              {% endfor %}
            {% else %}
              <span style="color:#999;">—</span><br>
            {% endif %}
          {% elsif titulo == "crown" %}
            {% if crown_color != "" %}<span>Crown: {{ crown_color }}</span><br>{% endif %}
          {% elsif titulo contains "ribbon" %}
            {% assign ribbon_txt = custom_ribbon_text %}
            {% if ribbon_txt == "" %}{% assign ribbon_txt = personalized_ribbon_text %}{% endif %}
            {% if ribbon_txt != "" %}<span><strong>Ribbon text:</strong> {{ ribbon_txt }}</span><br>{% endif %}
          {% elsif titulo contains "letters" or titulo contains "baby breath" %}
            {% if baby_breath_text != "" %}<span>{{ baby_breath_text }}</span><br>{% endif %}
          {% endif %}
        </td>
        <td class="td-price">{{ line_item.original_line_price | money }}</td>
      </tr>
      {% if es_bouquet or es_custom %}{% if b_card != "" %}
      <tr class="fin-grupo">
        <td class="td-img">{% if notes_img != "" %}<img class="accessory-img" src="{{ notes_img }}">{% endif %}</td>
        <td class="td-desc"><strong style="color:#8B1A3A;">💌 Card text:</strong><br><span class="card-text-content">{{ b_card }}</span></td>
        <td class="td-price">{{ notes_price }}</td>
      </tr>
      {% endif %}{% endif %}
    {% endfor %}
    {% for shipping_line in order.shipping_lines %}
      {% unless shipping_line.title contains "shown above" or shipping_line.price == 0 %}
      <tr>
        <td class="td-img"></td>
        <td class="td-desc"><strong>{{ shipping_line.title }}</strong></td>
        <td class="td-price">{{ shipping_line.price | money }}</td>
      </tr>
      {% endunless %}
    {% endfor %}
  </tbody>
</table>
{% assign factura_total = 0 %}
{% for li in order.line_items %}
  {% assign tl = li.product.title | downcase %}
  {% unless tl contains "service fee" or tl contains "shipping protection" or tl contains "protection" or tl contains "home delivery" %}
    {% assign factura_total = factura_total | plus: li.original_line_price %}
  {% endunless %}
{% endfor %}
<div class="total-row">
  TOTAL: {{ factura_total | money }}
</div>
{% assign hay_notas = false %}
{% for pb in prod_blocks %}{% if pb contains "Nota del cliente:" %}{% assign hay_notas = true %}{% endif %}{% endfor %}
{% if hay_notas %}
<hr>
<div class="cliente-nota-box">
  <h4>Notas del cliente</h4>
  {% for pb in prod_blocks %}
    {% if pb contains "Nota del cliente:" %}
      {% assign pname = "" %}
      {% if pb contains "Producto:" %}{% assign pname = pb | split: "Producto:" | last | split: "
" | first | strip %}{% endif %}
      {% assign nt = pb | split: "Nota del cliente:" | last | strip %}
      <p style="white-space:pre-wrap; margin-bottom:6px;">📝 {% if pname != "" %}<strong>{{ pname }}:</strong> {% endif %}<span style="font-style:italic;">{{ nt }}</span></p>
    {% endif %}
  {% endfor %}
</div>
{% endif %}
`;