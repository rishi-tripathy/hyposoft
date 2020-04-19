from ass_man.models import Asset

def restructure_net_port_data(graph_serializer):
    assets = []
    nodes = []
    seen_asset_ids = set()
    assets1 = []
    nps1 = []
    assets2 = []
    links = []
    newlinks = []

    master_data = graph_serializer.data
    data = graph_serializer.data

    root_rn = data.get("rack").get("rack_number") if data.get("rack") else ""
    root = {
        "id": data.get("id"),
        "hostname": data.get("hostname"),
        "location": "Rack {} U{}".format(root_rn, data.get("rack_u"))
    }

    assets.append(root)
    nodes.append({
        'id': root.get("hostname")
    })
    seen_asset_ids.add(data.get("id"))

    def process_l2(np, l1_id):
        c = np.get("connection")
        if c:
            data = c.get("asset")
            if data and (data.get("id") not in seen_asset_ids):
                a2_rn = data.get("rack").get("rack_number") if data.get("rack") else ""
                a2 = {
                    "id": data.get("id"),
                    "hostname": data.get("hostname"),
                    "location": "Rack {} U{}".format(a2_rn, data.get("rack_u"))
                }
                assets.append(a2)
                nodes.append({
                    'id': a2.get("hostname")
                })
                if int(l1_id) < int(data.get("id")):
                    links.append("{},{}".format(l1_id, data.get("id")))
                    newlinks.append({
                        'source': Asset.objects.get(id=l1_id).hostname,
                        'target': data.get("hostname"),
                    })
                else:
                    links.append("{},{}".format(data.get("id"), l1_id, ))
                    newlinks.append({
                        'source': data.get("hostname"),
                        'target': Asset.objects.get(id=l1_id).hostname,
                    })

    root_nps = data.get("network_ports")
    for np in root_nps:
        c = np.get("connection")
        if c:
            data = c.get("asset")
            if data and (data.get("id") not in seen_asset_ids):
                a1_rn = data.get("rack").get("rack_number") if data.get("rack") else ""
                a1 = {
                    "id": data.get("id"),
                    "hostname": data.get("hostname"),
                    "location": "Rack {} U{}".format(a1_rn, data.get("rack_u"))
                }
                assets.append(a1)
                nodes.append({
                    'id': a1.get("hostname")
                })
                if int(root.get("id")) < int(data.get("id")):
                    links.append("{},{}".format(root.get("id"), data.get("id")))
                    newlinks.append({
                        'source': root.get("hostname"),
                        'target': data.get("hostname")
                    })
                else:
                    links.append("{},{}".format(data.get("id"), root.get("id")))
                    newlinks.append({
                        'source': data.get("hostname"),
                        'target': root.get("hostname")
                    })

                for np2 in data.get("network_ports"):
                    process_l2(np2, data.get("id"))

    resp = {
        "data": {
            "assets": [dict(t) for t in {tuple(d.items()) for d in assets}],
            "connections": list(set(links))
        }
    }
    newresp = {
        "data": {
            "nodes": nodes,
            "links": newlinks,
            "focusNodeId": root.get("hostname")
        }
    }
    return newresp
