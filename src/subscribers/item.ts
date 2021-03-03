import { EventSubscriber, On } from "event-dispatch"
import { Container } from "typedi"
import { Logger } from "winston"
import { IUser } from "../interfaces/IUser"
import events from "./events"

@EventSubscriber()
export default class ItemSubscriber {
    @On(events.item.stage)
    public async onItemStage({ currentUser, itemIds }: { currentUser: Partial<IUser>, itemIds: string[] }) {
        const Logger: Logger = Container.get('logger')

        try {
            Logger.silly('Items staged')

            const UserModel = Container.get('userModel') as Models.UserModel
            await UserModel.findByIdAndUpdate(currentUser._id, { $push: {
                items: { $each: itemIds }
            } })
        } catch (error) {
            Logger.error(`Error on event ${events.item.stage}: %o`, error)
            throw error
        }
    }
    @On(events.item.delete)
    public async onItemsDelete({ currentUser, itemIds }: { currentUser: Partial<IUser>, itemIds: string[] }) {
        const Logger: Logger = Container.get('logger')

        try {
            Logger.silly('Items deleted')

            const UserModel = Container.get('userModel') as Models.UserModel
            await UserModel.findByIdAndUpdate(currentUser._id, { $pullAll: {
                items: itemIds
            } })
        } catch (error) {
            Logger.error(`Error on event ${events.item.delete}: %o`, error)
            throw error
        }
    }
}