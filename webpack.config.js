const path = require('path'); // подключаем путь

module.exports = {
	entry: {
		// libs: ['./js/script.js', './js/script2.js'], //точка входа, 2 файла вместе
		main: './src/index.js',
	},
	output: { // точка выхода
		path: path.resolve(__dirname, './dist'), // папка с именем проекта и папка dist
		filename: '[name].js', // берет из entry, будет ~ main.js
		publicPath: '/dist',
	},
	devServer: { // если проект не собрался, выходит ошибка
		overlay: true,
	},
	module: { // настройки модулей для бабеля
		rules: [{
			test: /\.js$/, // используются файлы с расширением js
			loader: 'babel-loader', // какой используем loader
			exclude: '/node_modules/', // исключение, чтобы ускорить компиляцию
		}],
	},
};
