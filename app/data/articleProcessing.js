function openMarker(idtoopen) {
	if(jQuery.isEmptyObject(map_info)) {
		$.getJSON('content/map_infowin.json', function(mapdata) { 
			map_info = mapdata;
		});
	}
	var contentstr = '<h1>'+locationNames[idtoopen]+'</h1>';
	var atitles = map_info[idtoopen];
	for(var alertc=0; alertc<atitles.length; alertc++) {
		contentstr += '<p>'+atitles[alertc].issue_date+' <a href="http://healthmap.org/ln.php?' + atitles[alertc].aid + '" target="_new">' + atitles[alertc].summary + '</a></p>';
	}
	infowindow.setContent(contentstr);
	infowindow.open(map,markerArray[idtoopen]);
}
function loadMarkers() {
	$.getJSON('content/links.json', function(linkdata) { 
		link_info = linkdata;
	});
	$.getJSON('content/markers.json', function(data) { 
		// make the last day of events highlighted on the map
		$.each( data.points, function(i, value) {
			var myLatlng = new google.maps.LatLng(value.lat, value.lon);
			var marker = new google.maps.Marker({
				id: value.id,
				position: myLatlng,
				map: map,
				title: value.name,
				icon: icons[1] 
			});
			markerArray[value.id] = marker; // save it in array
			locationNames[value.id] = value.name;
			google.maps.event.addListener(marker, 'click', function() {
				openMarker(value.id);
			});
		});
	});
}
function showMarkersHLselected(idnum) {
	var ids_associated = link_info[idnum]['ids_associated'];
	var ids_to_highlight = link_info[idnum]['ids_highlighted'];
	for (var mi in markerArray) {
		if(jQuery.inArray(parseInt(mi), ids_to_highlight) > -1) {
			markerArray[mi].setVisible(true);
			icon = 2;
		} else if(jQuery.inArray(parseInt(mi), ids_associated) > -1) {
			markerArray[mi].setVisible(true);
			icon = 1;
		} else {
			markerArray[mi].setVisible(false);
		}
		markerArray[mi].setIcon(icons[icon]);
	}
}
});


        