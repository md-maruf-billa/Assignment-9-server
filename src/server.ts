import app from "./app"
import configs from "./configs"

const main = async () => {
    app.listen(configs.port, () => {
        console.log(`Product Review server is running on: ${configs.port}`)
    })

}


main()