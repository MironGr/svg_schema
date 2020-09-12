
let SVG = document.querySelector('svg');
let svgNS = "http://www.w3.org/2000/svg";
let xlinkNS = "http://www.w3.org/1999/xlink";
let form = document.querySelector('form');
//размеры SVG
let SVG_width = SVG.getAttribute('width'); //[px]
let SVG_height = SVG.getAttribute('height'); //[px]

let svg_xy = SVG.getBoundingClientRect(); //для точных координат мыши в момент нажатия
// Создание отрезка
line_number = 1; // номер для id отрезка
let input_lines_text = 'lines'; //текст для формы поля input_lines
let input_lines = document.querySelector('#lines'); //скрытая форма для отправки на бэкенд
let line_button = document.querySelector('.create_line');
line_button.addEventListener('click', (e) => {
	//локальные переменные
	let line = document.createElementNS(svgNS,'line');
	let line_length_text = document.querySelector('#line_length'); //поле с длиной отрезка
	let line_angle_text = document.querySelector('#line_angle_degrees'); //поле с углом отрезка
	let distance_point_text = document.querySelector('#distance_point'); //поле с расстоянием до точки (слева на право)
	let lines = SVG.querySelectorAll('line');
	//ввод данных пользователем
	let line_length = round(line_length_text.value, 3); // [м]
	let line_angle = round(line_angle_text.value, 3); // [гр]
	let distance_point = round(distance_point_text.value, 3); // [м]
	//для отладки
	console.log('SVG_width- ' + SVG_width);
	console.log('ll - ' + line_length + ' la - ' + line_angle);
	//обработчик создания линии на SVG
	SVG.addEventListener('click', create_line);
	//выборка всех концевых окружностей
	let circles_end = SVG.querySelectorAll('.circle_end');
	//обработчик подсветки концов отрезков
	for (var i = 0; i < circles_end.length; i++) {
		circles_end[i].addEventListener('mouseover', backlight_end_line);
		circles_end[i].addEventListener('mouseout', backlight_end_line_out);
	};
	
	//масштабный коэффициент line_length[м] / line_length[px],
	//где line_length[м] - самый длинный отрезок (задается пользователем)
	//line_length[px] - произвольная длина отрезка в пикселях (высчитывается автоматически)
	if (lines.length < 1) {
		let line_length_px = SVG_height * 0.35; //0.2 - 20% от высоты SVG
		//глобальная переменная масштаба
		KL = round(line_length/line_length_px, 3); // [м]/[px]
		input_lines_text += ',KL-' + KL;
		console.log('KL=' + KL);
	};
	


	function create_line(e) { //начало отрезка по ЛКМ на SVG
		id = "line_" + line_number;
		if (distance_point && lines.length > 0) {
			try {
				x33 = round(cx_circle, 3);
				y33 = round(cy_circle, 3);
				cx_circle = 0;
				cy_circle = 0;
			} catch (err) {
				x33 = SVG_width / 2;
				y33 = SVG_height / 2;
				x33 = round(x33, 3);
				y33 = round(y33, 3);
			};

			//расчет положения конца отрезка в зависимости от угла наклона (+ против чс, - по чс)
			if (line_angle >= 0 && line_angle <= 90) {
				x11 = Math.abs(x33 - (distance_point / KL) * Math.cos(Math.PI * line_angle / 180));
				y11 = Math.abs(y33 + (distance_point / KL) * Math.sin(Math.PI * line_angle / 180));
				x11 = round(x11, 3);
				y11 = round(y11, 3);
			} else if (line_angle > 90 && line_angle <= 180) {
				x11 = Math.abs(x33 + (distance_point / KL) * Math.cos(Math.PI - Math.PI * line_angle / 180));
				y11 = Math.abs(y33 + (distance_point / KL) * Math.sin(Math.PI - Math.PI * line_angle / 180));
				x11 = round(x11, 3);
				y11 = round(y11, 3);
			} else if (line_angle < 0 && line_angle >= -90) {
				x11 = Math.abs(x33 - (distance_point / KL) * Math.cos(Math.PI * (line_angle * (-1)) / 180));
				y11 = Math.abs(y33 - (distance_point / KL) * Math.sin(Math.PI * (line_angle * (-1)) / 180));
				x11 = round(x11, 3);
				y11 = round(y11, 3);
			} else if (line_angle < -90 && line_angle >= -180) {
				x11 = Math.abs(x33 + (distance_point / KL) * Math.cos(Math.PI - Math.PI * (line_angle * (-1)) / 180));
				y11 = Math.abs(y33 - (distance_point / KL) * Math.sin(Math.PI - Math.PI * (line_angle * (-1)) / 180));
				x11 = round(x11, 3);
				y11 = round(y11, 3);
			};
		} else {
			try {
				x11 = round(cx_circle, 3);
				y11 = round(cy_circle, 3);
				cx_circle = 0;
				cy_circle = 0;
			} catch (err) {
				x11 = e.clientX - svg_xy.left - SVG.clientLeft;
				y11 = e.clientY - svg_xy.top - SVG.clientTop;
				x11 = round(x11, 3);
				y11 = round(y11, 3);
			};
		};
		//расчет положения конца отрезка в зависимости от угла наклона (+ против чс, - по чс)
		if (line_angle >= 0 && line_angle <= 90) {
			x22 = Math.abs(x11 + (line_length / KL) * Math.cos(Math.PI * line_angle / 180));
			y22 = Math.abs(y11 - (line_length / KL) * Math.sin(Math.PI * line_angle / 180));
			x22 = round(x22, 3);
			y22 = round(y22, 3);
		} else if (line_angle > 90 && line_angle <= 180) {
			x22 = Math.abs(x11 + (line_length / KL) * (-1) * Math.cos(Math.PI - Math.PI * line_angle / 180));
			y22 = Math.abs(y11 - (line_length / KL) * Math.sin(Math.PI - Math.PI * line_angle / 180));
			x22 = round(x22, 3);
			y22 = round(y22, 3);
		} else if (line_angle < 0 && line_angle >= -90) {
			x22 = Math.abs(x11 + (line_length / KL) * Math.cos(Math.PI * (line_angle * (-1)) / 180));
			y22 = Math.abs(y11 + (line_length / KL) * Math.sin(Math.PI * (line_angle * (-1)) / 180));
			x22 = round(x22, 3);
			y22 = round(y22, 3);
		} else if (line_angle < -90 && line_angle >= -180) {
			x22 = Math.abs(x11 + (line_length / KL) * (-1) * Math.cos(Math.PI - Math.PI * (line_angle * (-1)) / 180));
			y22 = Math.abs(y11 - (line_length / KL) * (-1) * Math.sin(Math.PI - Math.PI * (line_angle * (-1)) / 180));
			x22 = round(x22, 3);
			y22 = round(y22, 3);
		};
	

		//концевая окружность
		let class_circle = "circle_end"; //концевая окружность
		let circle = document.createElementNS(svgNS, 'circle');
		//окружность в начале отрезка
		circle.setAttributeNS(null, "class", class_circle); //конц окр
		circle.setAttributeNS(null, "cx", x11);
		circle.setAttributeNS(null, "cy", y11);
		circle.setAttributeNS(null, "r", "5");
		circle.setAttributeNS(null, "stroke-width", "5");
		//отрезок
		line.setAttributeNS(null, "id", id);
		line.setAttributeNS(null, "x1", x11);
		line.setAttributeNS(null, "y1", y11);
		line.setAttributeNS(null, "stroke", "black");
		line.setAttributeNS(null, "stroke-width", "10");
		line.setAttributeNS(null, "x2", x22);
		line.setAttributeNS(null, "y2", y22);
		//окружность на конце отрезка
		let circle_2 = document.createElementNS(svgNS, 'circle');
		circle_2.setAttributeNS(null, "class", class_circle); //конц окр
		circle_2.setAttributeNS(null, "cx", x22);
		circle_2.setAttributeNS(null, "cy", y22);
		circle_2.setAttributeNS(null, "r", "5");
		circle_2.setAttributeNS(null, "stroke-width", "5");
		SVG.append(line);
		SVG.append(circle);
		SVG.append(circle_2);
		line_number++; //увеличение id линии
		//для отладки
		input_lines_text += ',id-' + id + ',x1-' + x11 + ',y1-' + y11 + ',x2-' + x22 + ',y2-' + y22;
		input_lines.value = input_lines_text;
		console.log(input_lines_text);
		//удаление обработчика клика с SVG
		SVG.removeEventListener('click', create_line);
		//удаление обработчика подсветки концов отрезков
		for (var i = 0; i < circles_end.length; i++) {
			//console.log(circles_end[i]);
			circles_end[i].removeEventListener('mouseover', backlight_end_line);
			circles_end[i].removeEventListener('mouseout', backlight_end_line_out);
		};
	};

	 
	function backlight_end_line(e) { //подсветка конца отрезка при наведении
		this.classList.add("circle_end_green");
		this.addEventListener('click', get_cx_cy);
	};

	function backlight_end_line_out(e) { //удаление подсветки концов отрезков при наведении
		this.classList.remove("circle_end_green");
		this.removeEventListener('click', get_cx_cy);	
	};

	function get_cx_cy(e) {
		// запись в глобальные переменные координат выделенной точки
		cx_circle = this.getAttribute("cx");
		cy_circle = this.getAttribute("cy");
		this.classList.remove("circle_end_green");
		this.removeEventListener('click', get_cx_cy);
	};

	function create_line_mousemove(e) {  //конец отрезка ЛКМ по SVG
		line.setAttributeNS(null, "x2", e.clientX - svg_xy.left - SVG.clientLeft);
		line.setAttributeNS(null, "y2", e.clientY - svg_xy.top - SVG.clientTop);
	};

});

// Создание связей 2-го рода (неподвижные шарниры в виде окружностей)
node_2_number = 1; //номер id для связи
let input_nodes_2_text = 'nodes_2'; //текст для формы поля input_lines
let input_nodes_2 = document.querySelector('#nodes_2'); //скрытая форма для отправки на бэкенд
let node_2_button = document.querySelector('.node_2');
node_2_button.addEventListener('click', (e) => {
	//локальные переменные
	cx_node_2 = 0; //при случайном нажании в пустое место SVG связь нарисуется в левом верхнем углу
	cy_node_2 = 0;
	let node_2 = document.createElementNS(svgNS,'circle');
	let circles_end = document.querySelectorAll('.circle_end');
	for (let i = 0; i < circles_end.length; i++) {
		circles_end[i].addEventListener('mouseover', backlight_circle_end_in);
		circles_end[i].addEventListener('mouseout', backlight_circle_end_out);
	};
	SVG.addEventListener('click', create_node_2);

	function create_node_2(e) { //создание связи 2-го рода (шарнира) при ЛКМ по SVG
		node_2_id = 'node2_' + node_2_number;
		node_2.setAttributeNS(null, 'cx', cx_node_2);
		node_2.setAttributeNS(null, 'cy', cy_node_2);
		node_2.setAttributeNS(null, "r", "7");
		node_2.setAttributeNS(null, "stroke-width", "5");
		node_2.setAttributeNS(null, 'id', node_2_id);
		node_2.setAttributeNS(null, 'class', 'node_2');
		node_2_number++;
		input_nodes_2_text += ',id-' + node_2_id + ',cx-' + cx_node_2 + ',cy-' + cy_node_2;
		input_nodes_2.value = input_nodes_2_text;
		//Для отладки
		console.log('cx_node_2- ' + cx_node_2 + ' cy_node_2- ' + cy_node_2);
		console.log(input_nodes_2_text);
		SVG.append(node_2);
		SVG.removeEventListener('click', create_node_2);
		for (let i = 0; i < circles_end.length; i++) {
			circles_end[i].removeEventListener('mouseover', backlight_circle_end_in);
			circles_end[i].removeEventListener('mouseout', backlight_circle_end_out);
		};	
	};

	function backlight_circle_end_in(e) {
		this.classList.add('circle_end_yellow');
		this.addEventListener('click', cx_cy_node_2);
	};

	function backlight_circle_end_out(e) {
		this.classList.remove('circle_end_yellow');
	};

	function cx_cy_node_2(e) {
		cx_node_2 = this.getAttribute('cx');
		cy_node_2 = this.getAttribute('cy');
		this.classList.remove('circle_end_yellow');
		this.removeEventListener('click', cx_cy_node_2);
	};
});


// Создание связей 1-го рода (опора в виде линии и точки)
node_1_number = 1; //номер id для связи
let input_nodes_1_text = 'nodes_1'; //текст для формы поля input_nodes_1
let input_nodes_1 = document.querySelector('#nodes_1'); //скрытая форма для отправки на бэкенд
let node_1_button = document.querySelector('.node_1');
node_1_button.addEventListener('click', (e) => {
	//локальные переменные
	cx_node_1 = 0; //при случайном нажании в пустое место SVG связь нарисуется в левом верхнем углу
	cy_node_1 = 0;
	let node_1_line = document.createElementNS(svgNS,'line');
	let node_1_circle = document.createElementNS(svgNS,'circle');
	let lines = SVG.querySelectorAll('line');
	let node_1_angle_text = document.querySelector('.node_1_angle');
	let node_1_distance_text = document.querySelector('.node_1_distance');
	for (let i = 0; i < lines.length; i++) {
		lines[i].addEventListener('mouseover', backlight_line_in);
		lines[i].addEventListener('mouseout', backlight_line_out);
	};
	SVG.addEventListener('click', create_node_1);

	function create_node_1(e) { //создание связи 1-го рода (опоры) при ЛКМ по SVG
		node_1_id = 'node_1-' + node_1_number;
		node_1_line.setAttributeNS(null, 'class', 'node_1_line');
		node_1_circle.setAttributeNS(null, 'class', 'node_1_circle');
		node_1_line.setAttributeNS(null, 'stroke-width', '3');
		node_1_circle.setAttributeNS(null, 'stroke-width', '5');
		node_1_circle.setAttributeNS(null, 'r', '3');
		node_1_line_length = round(SVG_height * 0.1, 3); //для определении конечной точки связи
		//локальные функциональные переменные
		let coordinate_x_y = 0;
		let node_1_angle = node_1_angle_text.value;
		let node_1_distance_m = node_1_distance_text.value;
		node_1_angle = round(node_1_angle, 3);
		node_1_distance_m = round(node_1_distance_m, 3);
		let node_1_distance_px = node_1_distance_m / KL;
		node_1_distance_px = round(node_1_distance_px, 3);
		try {
			x11 = round(x1_node_1, 3);
			y11 = round(y1_node_1, 3);
			x22 = round(x2_node_1, 3);
			y22 = round(y2_node_1, 3);
			x1_node_1 = 0;
			y1_node_1 = 0;
			x2_node_1 = 0;
			y2_node_1 = 0;
		} catch (err) {
			x11 = 0;
			y11 = 0;
			x22 = 0;
			y22 = 0;
		}; 
		if (node_1_distance_m) {
			coordinate_x_y = point_on_segment(line_x11=x11, line_y11=y11, line_x22=x22, line_y22=y22, z=node_1_distance_px);
		} else {
			coordinate_x_y = point_on_segment(line_x11=x11, line_y11=y11, line_x22=x22, line_y22=y22);
		};
		let node_1_x1 = coordinate_x_y.get('x');
		let node_1_y1 = coordinate_x_y.get('y');
		//угол наклона связи относительно Х (+ против ЧС) в [гр]
		//отрицательныйх углов нет, т.к направление реакции определяется из расчета
		//координаты конечной точки связи
		if (node_1_angle >= 0 && node_1_angle <= 90) {
			node_1_x2 = Math.abs(node_1_x1 - node_1_line_length * Math.cos(Math.PI * node_1_angle / 180));
			node_1_y2 = Math.abs(node_1_y1 + node_1_line_length * Math.sin(Math.PI * node_1_angle / 180));
			node_1_x2 = round(node_1_x2, 3);
			node_1_y2 = round(node_1_y2, 3);
		} else if (node_1_angle > 90 && node_1_angle <= 180) {
			node_1_x2 = Math.abs(node_1_x1 + Math.cos(Math.PI - Math.PI * node_1_angle / 180));
			node_1_y2 = Math.abs(node_1_y1 + Math.sin(Math.PI - Math.PI * node_1_angle / 180));
			node_1_x2 = round(node_1_x2, 3);
			node_1_y2 = round(node_1_y2, 3);
		};
		//координаты первой точки связи на участке конструкции
		node_1_line.setAttributeNS(null, 'x1', node_1_x1);
		node_1_line.setAttributeNS(null, 'y1', node_1_y1);
		node_1_line.setAttributeNS(null, 'x2', node_1_x2);
		node_1_line.setAttributeNS(null, 'y2', node_1_y2);
		node_1_circle.setAttributeNS(null, 'cx', node_1_x2);
		node_1_circle.setAttributeNS(null, 'cy', node_1_y2);
		node_1_number++;
		SVG.append(node_1_line);
		SVG.append(node_1_circle);
		//для отправки на бэкенд
		input_nodes_1_text += ',id-' + node_1_id + ',x1-' + node_1_x1 + ',y1-' + node_1_y1 + ',alfa-' + node_1_angle + ',line_id-' + line_id_node_1;
		input_nodes_1.value = input_nodes_1_text;
		SVG.removeEventListener('click', create_node_1);
		for (let i = 0; i < lines.length; i++) {
			lines[i].removeEventListener('mouseover', backlight_line_in);
			lines[i].removeEventListener('mouseout', backlight_line_out);
		};	
	};

	function backlight_line_in(e) {
		this.classList.add('line_green');
		this.addEventListener('click', x_y_node_1);
	};

	function backlight_line_out(e) {
		this.classList.remove('line_green');
	};

	function x_y_node_1(e) {
		x1_node_1 = this.getAttribute('x1');
		y1_node_1 = this.getAttribute('y1');
		x2_node_1 = this.getAttribute('x2');
		y2_node_1 = this.getAttribute('y2');
		line_id_node_1 = this.getAttribute('id');
		this.classList.remove('line_green');
		this.removeEventListener('click', x_y_node_1);
	};
});


//Создание сосредоточенной нагрузки (силы)
let force_id = 1;
let input_force_point_text = 'forces_point'; //текст для формы поля forces_point
let force_button = document.querySelector('.force_point');
let input_force_point = document.querySelector('#forces_point'); //скрытая форма для отправки на бэкенд
force_button.addEventListener('click', (e) => {
	//локальные переменные
	let lines = SVG.querySelectorAll('line');
	let force_line = document.createElementNS(svgNS,'line');
	//угол наклона вектора
	let force_angle_text = document.querySelector('.force_point_angle');
	//расстояние от левой / верхней точки отрезка до точки приложения силы
	let force_distance_text = document.querySelector('.force_point_distance');
	//направление вектора силы
	let force_point_direction_text = document.querySelector('.force_point_direction');
	let force_point_direction = force_point_direction_text.value;
	//модуль вектора силы
	let force_point_modul_text = document.querySelector('.force_point_modul');
	let force_point_modul = round(force_point_modul_text.value, 3);
	//стрелка-указатель направления
	let arrow = document.createElementNS(svgNS, 'circle'); //для теста направление - окружность
	let arrow_1 = document.createElementNS(svgNS, 'line');
	let arrow_2 = document.createElementNS(svgNS, 'line');
	let arrow_angle = 30;  // угол полураствора стрелки-указателя
	//текст для отправки на бэкенд
	let input_forces_point = document.querySelector('#forces_point');
	for (let i = 0; i < lines.length; i++) {
		lines[i].addEventListener('mouseover', backlight_line_in);
		lines[i].addEventListener('mouseout', backlight_line_out);
	};

	SVG.addEventListener('click', create_force_point);

	function create_force_point(e) { //создание сосредоточенной нагрузки при ЛКМ по SVG
		//id соредоточенной нагрузки
		let force_id_text = 'fp-' + force_id; //id вектора силы
		//угол наклона вектора
		let force_angle = round(force_angle_text.value, 3);
		//расстояние от левой / верхней точки отрезка до точки приложения силы
		let force_distance_m = round(force_distance_text.value, 3);
		let force_distance_px = round(force_distance_m / KL, 3);
		force_distance_px = round(force_distance_px, 3);
		console.log('force_distance_m - ' + force_distance_m + ',force_angle - ' + force_angle);
		let force_line_length = round(SVG_height * 0.15, 3); 	//длина вектора силы
		let arrow_length = round(SVG_height * 0.05, 3); 		//длина стрелок вектора силы
		try {
			x11 = round(x1_force, 3);
			y11 = round(y1_force, 3);
			x22 = round(x2_force, 3);
			y22 = round(y2_force, 3);
		} catch {
			x11 = 0;
			y11 = 0;
			x22 = 0;
			y22 = 0;
		};
		if (force_distance_m) {
			coordinate_x_y = point_on_segment(line_x11=x11, line_y11=y11, line_x22=x22, line_y22=y22, z=force_distance_px);
		} else {
			coordinate_x_y = point_on_segment(line_x11=x11, line_y11=y11, line_x22=x22, line_y22=y22);
		};
		let x1_force_line = coordinate_x_y.get('x');
		let y1_force_line = coordinate_x_y.get('y');
		//конечная точка вектора силы
		if (force_angle > 0 && force_angle < 90) { //добавить 90...180 гр
			x2_force_line = Math.abs(x1_force_line - force_line_length * Math.cos(Math.PI * force_angle / 180));
			y2_force_line = Math.abs(y1_force_line + force_line_length * Math.sin(Math.PI * force_angle / 180));
		};
		if (force_point_direction == 1) {
			//первая стрелка
			let x1_arrow_1 = x1_force_line;
			let y1_arrow_1 = y1_force_line;
			let x2_arrow_1 = round((x1_force_line - arrow_length * Math.cos(Math.PI * (180-force_angle-arrow_angle) / 180)), 3);
			let y2_arrow_1 = round((y1_force_line + arrow_length * Math.sin(Math.PI * (180-force_angle-arrow_angle) / 180)), 3);
			arrow_1.setAttributeNS(null, 'class', 'arrow');
			arrow_1.setAttributeNS(null, 'x1', x1_arrow_1);
			arrow_1.setAttributeNS(null, 'y1', y1_arrow_1);
			arrow_1.setAttributeNS(null, 'x2', x2_arrow_1);
			arrow_1.setAttributeNS(null, 'y2', y2_arrow_1);
			arrow_1.setAttributeNS(null, 'stroke-width', '3');
			//окружность
			arrow.setAttributeNS(null, 'class', 'arrow');
			arrow.setAttributeNS(null, 'cx', x1_arrow_1);
			arrow.setAttributeNS(null, 'cy', y1_arrow_1);
			arrow.setAttributeNS(null, 'r', 3);
			arrow.setAttributeNS(null, 'stroke-width', '3');
			SVG.append(arrow);
			//вторая стрелка
			let x1_arrow_2 = x1_force_line;
			let y1_arrow_2 = y1_force_line;
			let x2_arrow_2 = round((x1_force_line - arrow_length * Math.sin(Math.PI * (90-force_angle+arrow_angle) / 180)), 3);
			let y2_arrow_2 = round((y1_force_line + arrow_length * Math.cos(Math.PI * (90-force_angle+arrow_angle) / 180)), 3);
			arrow_2.setAttributeNS(null, 'class', 'arrow');
			arrow_2.setAttributeNS(null, 'x1', x1_arrow_2);
			arrow_2.setAttributeNS(null, 'y1', y1_arrow_2);
			arrow_2.setAttributeNS(null, 'x2', x2_arrow_2);
			arrow_2.setAttributeNS(null, 'y2', y2_arrow_2);
			arrow_2.setAttributeNS(null, 'stroke-width', '3');
		} else if (force_point_direction == -1) {
			//первая стрелка
			let x1_arrow_1 = x2_force_line;
			let y1_arrow_1 = y2_force_line;
			let x2_arrow_1 = round((x2_force_line + arrow_length * Math.sin(Math.PI * (90-force_angle-arrow_angle) / 180)), 3);
			let y2_arrow_1 = round((y2_force_line - arrow_length * Math.cos(Math.PI * (90-force_angle-arrow_angle) / 180)), 3);
			arrow_1.setAttributeNS(null, 'class', 'arrow');
			arrow_1.setAttributeNS(null, 'x1', x1_arrow_1);
			arrow_1.setAttributeNS(null, 'y1', y1_arrow_1);
			arrow_1.setAttributeNS(null, 'x2', x2_arrow_1);
			arrow_1.setAttributeNS(null, 'y2', y2_arrow_1);
			arrow_1.setAttributeNS(null, 'stroke-width', '3');
			//окружность
			arrow.setAttributeNS(null, 'class', 'arrow');
			arrow.setAttributeNS(null, 'cx', x1_arrow_1);
			arrow.setAttributeNS(null, 'cy', y1_arrow_1);
			arrow.setAttributeNS(null, 'r', 3);
			arrow.setAttributeNS(null, 'stroke-width', '3');
			SVG.append(arrow);
			//вторая стрелка
			let x1_arrow_2 = x2_force_line;
			let y1_arrow_2 = y2_force_line;
			let x2_arrow_2 = round((x1_force_line + arrow_length * Math.cos(Math.PI * Math.abs(force_angle-arrow_angle) / 180)), 3);
			let y2_arrow_2 = round((y1_force_line - arrow_length * Math.sin(Math.PI * Math.abs(force_angle-arrow_angle) / 180)), 3);
			arrow_2.setAttributeNS(null, 'class', 'arrow');
			arrow_2.setAttributeNS(null, 'x1', x1_arrow_2);
			arrow_2.setAttributeNS(null, 'y1', y1_arrow_2);
			arrow_2.setAttributeNS(null, 'x2', x2_arrow_2);
			arrow_2.setAttributeNS(null, 'y2', y2_arrow_2);
			arrow_2.setAttributeNS(null, 'stroke-width', '3');
		};
		//атрибуты линии силы
		force_line.setAttributeNS(null, 'class', 'force_line');
		force_line.setAttributeNS(null, 'x1', x1_force_line);
		force_line.setAttributeNS(null, 'y1', y1_force_line);
		force_line.setAttributeNS(null, 'x2', x2_force_line);
		force_line.setAttributeNS(null, 'y2', y2_force_line);
		force_line.setAttributeNS(null, 'stroke-width', '3');
		input_force_point_text += ',id-' + force_id_text + ',fa-' + force_angle; 
		input_force_point_text += ',fd-' + force_distance_m + ',fm-' + force_point_modul + ',ob-' + line_id;
		input_forces_point.value += input_force_point_text;
		input_force_point_text = '';
		console.log(input_forces_point.value);
		SVG.append(force_line);
		SVG.removeEventListener('click', create_force_point);
		force_id++;
		for (let i = 0; i < lines.length; i++) {
			lines[i].removeEventListener('mouseover', backlight_line_in);
			lines[i].removeEventListener('mouseout', backlight_line_out);
		};	
	};

	function backlight_line_in(e) {
		this.classList.add('line_red');
		this.addEventListener('click', x_y_force);
	};

	function backlight_line_out(e) {
		this.classList.remove('line_red');
	};

	function x_y_force(e) {
		x1_force = this.getAttribute('x1');
		y1_force = this.getAttribute('y1');
		x2_force = this.getAttribute('x2');
		y2_force = this.getAttribute('y2');
		line_id = this.getAttribute('id');
		this.classList.remove('line_red');
		this.removeEventListener('click', x_y_force);
	};


});


//Математические сервисы
//округление десятичых чисел по математическим правилам до decimals знаков после запятой
function round(value, decimals) {
	return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
};

//почение координат (х, у) точки, лежащей на отрезке на расстоянии (z) от крайней левой точки отрезка
function point_on_segment(line_x11=0, line_y11=0, line_x22=0, line_y22=0, z=0) {
	//все аргументы > 0
	//определение начала / конца отрезка слева направо (по Х) в системе координат экрана
	let line_y1 = 0;
	let line_y2 = 0;
	let line_x1 = 0;
	let line_x2 = 0;
	let y = 0;
	if (line_x11 < line_x22) {
		line_y1 = line_y11;
		line_y2 = line_y22;
		line_x1 = line_x11;
		line_x2 = line_x22;
	} else {
		line_y1 = line_y22;
		line_y2 = line_y11;
		line_x1 = line_x22;
		line_x2 = line_x11;
	};
	//угол наклона [рад] отрезка относительно оси Х (направление не имеет значения)
	let alfa = Math.atan(Math.abs(line_y1 - line_y2) / Math.abs(line_x1 - line_x2));
	let del_x = z * Math.cos(alfa); //смещение по Х
	let del_y = z * Math.sin(alfa); //смещение по Y
	let x = line_x1 + del_x;
	if (line_y1 < line_y2) {
		y = line_y1 + del_y;
	} else {
		y = line_y1 - del_y; 
	};
	var coordinate = new Map();
	coordinate.set('x', x).set('y', y);
	return coordinate;
}; 
