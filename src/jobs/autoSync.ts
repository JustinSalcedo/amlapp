import { Job } from "agenda"
import { Container, Inject } from "typedi"
import { Logger } from "winston"
import ListService from "../services/mercado-libre/list"
import StagingService from "../services/staging"
import SynchronizerService from "../services/synchronizer"

export default class AutoSyncJob {
    constructor(
        @Inject('logger') private logger: Logger
    ) {}

    public async handler(job: Job, done: (err: Error) => void): Promise<void> {
        try {
            this.logger.debug("Auto-Sync Job triggered")

            const UserModel = Container.get('userModel') as Models.UserModel
            const userRecords = await UserModel.find()

            userRecords.forEach(async user => {
                const synchronizerServiceInstance = Container.get(SynchronizerService)
                const updatedRecords = await synchronizerServiceInstance.AutoSyncAllowedItems(user)
                
                if (updatedRecords.length > 0) {
                    const stagingServiceInstance = Container.get(StagingService)
                    const restagedItems = await stagingServiceInstance.RestageItems(user, updatedRecords)

                    const listServiceInstance = Container.get(ListService)
                    await listServiceInstance.UpdateManyItems(user, restagedItems)
                }
            })
        } catch (error) {
            this.logger.error('Error with Auto-Sync Job: %o', error)
            done(error)
        }
    }
}