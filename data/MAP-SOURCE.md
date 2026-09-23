Country outlines: Natural Earth, 1:110m admin 0 countries.
Source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson
Natural Earth data is public domain: https://www.naturalearthdata.com/about/terms-of-use/

`build-static.cjs` generates `locations.js` from the local country/province JSON
and this GeoJSON, retaining only country names/codes and geometry. This bundle
also works on file:// previews and provides a base map when street tiles fail.
