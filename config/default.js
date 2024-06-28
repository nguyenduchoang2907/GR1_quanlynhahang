module.exports = {
    app: {
        port: 6969,
        static_folder: `${__dirname}/../src/public`,
        router: `${__dirname}/../src/routers/web`,
        view_folder : `${__dirname}/../src/apps/views`,
        view_engine : "ejs",
        session_key : "SESSION_KEY",
    },
    
mail: {
	host: "smtp.gmail.com",
	post: 587,
	secure: false,
	auth: {
		user: "su639282@gmail.com",
		pass: "xivk qggz vdju ttrw",//mã ứng dụng
	}
}

}