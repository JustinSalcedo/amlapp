import { Inject, Service } from "typedi";
import { Logger } from "winston";
import { IUser, IUserConfigStatus } from "../interfaces/IUser";

@Service()
export default class UserService {
    constructor(
        @Inject('userModel') private userModel: Models.UserModel,
        @Inject('logger') private logger: Logger
    ) {}

    public async UpdateProfileData({ _id, name, email }: Partial<IUser>, { inputName, inputEmail }: { inputName?: string, inputEmail?: string }): Promise<IUser> {
        try {
            const userRecord = await this.userModel.findByIdAndUpdate(_id, { $set: {
                name: inputName ? inputName : name,
                email: inputEmail ? inputEmail : email
            } }, { new: true })

            const user = userRecord.toObject()
            Reflect.deleteProperty(user, 'password')
            Reflect.deleteProperty(user, 'salt')
            Reflect.deleteProperty(user, 'config')
            Reflect.deleteProperty(user, 'redirect_urls')
            return user
        } catch (error) {
            throw error
        }
    }

    public monitorUserConfigStatus({ config }: Partial<IUser>): IUserConfigStatus {
        try {
            const mercado_libre_authorization = config.ml_token ? true : false
            const rapidapi_key_added = config.rapidapi_key ? true : false
            const configuration_complete = (mercado_libre_authorization && rapidapi_key_added) ? true : false

            return {
                configuration_complete,
                mercado_libre_authorization,
                rapidapi_key_added
            }
        } catch (error) {
            throw error
        }
    }
}