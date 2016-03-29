var char_cache = {};
function constructString(str, mat){
	var strObj = new THREE.Object3D();
	var offset = 0;
	for (var i = 0; i < str.length; i++) {
		if (!char_cache[str[i]]) {
			var char_geometry = new THREE.TextGeometry(str[i], {curveSegments: 2 });
			char_geometry.computeBoundingBox();
			char_cache[str[i]] = new THREE.Mesh(char_geometry, mat);
			// HACK GearVR doesn't seem to like reused geometries 
			// unless you add them to the scene individually first.
			var dummy = char_cache[str[i]].clone();
			dummy.visible = false;
			scene.add(dummy);
		}
		var char = char_cache[str[i]].clone();
		char.name = str[i];
		char.material = mat;
		char.position.x = offset;
		var char_width = char.geometry.boundingBox.size().x;
		if (char_width === -Infinity) { char_width = 20; }
		char_width += 15;
		// HACK because the digit '1' seems to have weird kerning.
		if (str[i] === '1') {
			char.position.x -= 20;
		}
		offset += char_width;
		strObj.add(char);
	}
	return strObj;
}

var colored_mat_cache = {};
function getColoredMaterial(color) {
	if (!colored_mat_cache[color]) {
		colored_mat_cache[color] = new THREE.MeshBasicMaterial({color:color});
	}
	return colored_mat_cache[color];
}

function recursiveVisibility(obj, visible) {
	obj.traverse(function (obj) {
		obj.visible = visible;
	});
}
