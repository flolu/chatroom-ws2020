import {NetworkLog} from '@libs/schema'
import {createAction, props} from '@ngrx/store'

const log = createAction('log', props<{log: NetworkLog}>())

export const LogsActions = {log}
