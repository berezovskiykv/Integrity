#INCLUDE "ObservablePopup.js"
/**
 * Класс для попапа состояний алгоритма
 * @class algstatePopup
 * @extends ObservablePopup
 */
class algStatePopup extends ObservablePopup {
    constructor (publisher, config) {
        super(config);
        let context = this;
        this.setupSignalsPath();
        this.initialize();
        //publisher.register([context.statePath], (newValue) => {context.updatePopupText(newValue.quality)}, 'q')
    }

    setupSignalsPath() {
        this.statePath = `${this.rootPath}.Status`;
        this.config.Title = accessData.stringValue(`${this.rootPath}.Name_Object`)
        this.config.Subtitle = accessData.stringValue(`${this.rootPath}.Name_Object1`)
        this.config.Code = accessData.stringValue(`${this.rootPath}.Type`);
    }

    initialize() {
        title.access.setStringValue(this.config.Title, "Text");
        subtitle.access.setStringValue(this.config.Subtitle, "Text");
    }

    /** Устанавливает биты состояний алгоритмов*/
    processStatusBits() {
        let state = accessData.doubleValue(this.statePath);
        if (state === null || state === undefined) return; 
        
        let defineCLR = (name, description, actCLR, tag = state) => {
            let sts = !!(tag & accessData.intValue(`${this.config.Code}.Status.${name}`))
            let descr = (description !== '') ? description : accessData.stringValue(`${this.config.Code}.Status.${name}.Description`)
            return { sts, descr, clr: sts ? actCLR : colors.ALGKSPG.Statusbit.inact }
        }

        return {
            //Аварийный останов
            AO_BPAiV            :   defineCLR('AO_BPAiV', '', colors.ALGKSPG.Statusbit.actAlm),
            AO_BIRG             :   defineCLR('AO_BIRG', '', colors.ALGKSPG.Statusbit.actAlm),
            AO_BR               :   defineCLR('AO_BR', '', colors.ALGKSPG.Statusbit.actAlm),
            AO_LSPG             :   defineCLR('AO_LSPG', '', colors.ALGKSPG.Statusbit.actAlm),
            AO_BhBoSK           :   defineCLR('AO_BhBoSK', '', colors.ALGKSPG.Statusbit.actAlm),
            AO_EO               :   defineCLR('AO_EO', '',colors.ALGKSPG.Statusbit.actAlm),
            AO_LPUMG            :   defineCLR('AO_LPUMG', 'Отсечные клапана 299-1, 299-1.1, 299-1.2, 299-1.3 закрыты', colors.ALGKSPG.Statusbit.actWrn),
            AO_Man              :   defineCLR('AO_Man', '', colors.ALGKSPG.Statusbit.actAlm),
            AO_NORM             :   defineCLR('AO_AO_NORM', '', colors.ALGKSPG.Statusbit.actNorm),
            AO_GPES_STOP        :   defineCLR('AO_GPES_STOP', '', colors.ALGKSPG.Statusbit.actAlm),
            AO_LSPG_RDY         :   defineCLR('AO_LSPG_RDY', '', colors.ALGKSPG.Statusbit.actNorm),
            AO_LSPG_SPG_Block   :   defineCLR('AO_LSPG_SPG_Block', '',colors.ALGKSPG.Statusbit.actWrn),
            AO_BhBo_SPG_Block   :   defineCLR('AO_BhBo_SPG_Block', 'БХБО: подача СПГ в резервуары перекрыта', colors.ALGKSPG.Statusbit.actWrn),
            AO_LSPG_Flow_Block  :   defineCLR('AO_LSPG_Flow_Block', '', colors.ALGKSPG.Statusbit.actWrn),
            AO_BhBo_Flow_Block  :   defineCLR('AO_BhBo_Flow_Block', 'БХБО: обратный поток паровой фазы перекрыт', colors.ALGKSPG.Statusbit.actWrn),    
            AO_BR_Rdy           :   defineCLR('AO_BR_Rdy', '', colors.ALGKSPG.Statusbit.actNorm),
            AO_BhBoSK_Rdy       :   defineCLR('AO_BhBoSK_Rdy', 'БХБОСК: Готовность к пуску/Треб. захолаж/Захоложен/Отгрузка СПГ', colors.ALGKSPG.Statusbit.actNorm),
            AO_EO_Rdy           :   defineCLR('AO_EO_Rdy', '', colors.ALGKSPG.Statusbit.actNorm),
            AO_LPUMG_Rdy        :   defineCLR('AO_LPUMG_Rdy', 'Отсечные клапана 299-1, 299-1.1, 299-1.2, 299-1.3 открыты', colors.ALGKSPG.Statusbit.actWrn),
            AO_BR_NoLink        :   defineCLR('AO_BR_NoLink', 'Отсутствие связи с БР', colors.ALGKSPG.Statusbit.actAlm),
            AO_LSPG_NoLink      :   defineCLR('AO_LSPG_NoLink', 'Отсутствие связи с ЛСПГ', colors.ALGKSPG.Statusbit.actAlm),
            AO_BR_NoLink_Msk    :   defineCLR('AO_BR_NoLink_Msk', 'Маска отсутствие связи с БР', colors.ALGKSPG.Statusbit.actWrn),
            AO_LSPG_NoLink_Msk  :   defineCLR('AO_LSPG_NoLink_Msk', 'Маска отсутствие связи с ЛСПГ', colors.ALGKSPG.Statusbit.actWrn),

            //Нормальный останов
            NO_BhBo             :   defineCLR('NO_BhBo', '', colors.ALGKSPG.Statusbit.actWrn),
            NO_GPES_STOP        :   defineCLR('NO_GPES_STOP', 'ЭО: ГПЭС остановлены', colors.ALGKSPG.Statusbit.actAlm),
            NO_LSPG_RDY         :   defineCLR('NO_LSPG_RDY', '', colors.ALGKSPG.Statusbit.actNorm),
            NO_LSPG_SPG_Block   :   defineCLR('NO_LSPG_SPG_Block', '', colors.ALGKSPG.Statusbit.actWrn),
            NO_BhBo_SPG_Block   :   defineCLR('NO_BhBo_SPG_Block', 'БХБО: Подача СПГ в резервуары перекрыта', colors.ALGKSPG.Statusbit.actWrn),
            NO_LSPG_Flow_Block  :   defineCLR('NO_LSPG_Flow_Block', '', colors.ALGKSPG.Statusbit.actWrn),
            NO_BhBo_Flow_Block  :   defineCLR('NO_BhBo_Flow_Block', 'БХБО: Обратный поток паровой фазы перекрыт', colors.ALGKSPG.Statusbit.actWrn),
            NO_PAZ              :   defineCLR('NO_PAZ', '', colors.ALGKSPG.Statusbit.actAlm),
            NO_BPAiV_Run        :   defineCLR('NO_BPAiV_Run', '', colors.ALGKSPG.Statusbit.actNorm),
            NO_BIRG_Run         :   defineCLR('NO_BIRG_Run', '', colors.ALGKSPG.Statusbit.actNorm),
            NO_BR_Rdy           :   defineCLR('NO_BR_Rdy', '', colors.ALGKSPG.Statusbit.actNorm),
            NO_BhBoSK_Rdy       :   defineCLR('NO_BhBoSK_Rdy', 'БХБОСК: Готовность к пуску/Треб. захолаж/Захоложен/Отгрузка СПГ', colors.ALGKSPG.Statusbit.actNorm),
            NO_LPUMG_Rdy        :   defineCLR('NO_LPUMG_Rdy', 'Отсечные клапана 299-1, 299-1.1, 299-1.2, 299-1.3 открыты', colors.ALGKSPG.Statusbit.actWrn),

            //Готовность к пуску
            RDYRUN_PAZ          :   defineCLR('RDYRUN_PAZ', '', colors.ALGKSPG.Statusbit.actAlm),
            RDYRUN_BPAiV_Run    :   defineCLR('RDYRUN_BPAiV_Run', '', colors.ALGKSPG.Statusbit.actNorm),
            RDYRUN_BIRG_Run     :   defineCLR('RDYRUN_BIRG_Run', '', colors.ALGKSPG.Statusbit.actNorm),
            RDYRUN_BR_Rdy       :   defineCLR('RDYRUN_BR_Rdy', '', colors.ALGKSPG.Statusbit.actNorm),
            RDYRUN_LSPG_RDY     :   defineCLR('RDYRUN_LSPG_RDY', '', colors.ALGKSPG.Statusbit.actNorm),
            RDYRUN_BhBoSK_Rdy   :   defineCLR('RDYRUN_BhBoSK_Rdy', 'БХБОСК: Готовность к пуску/Треб. захолаж/Захоложен/Отгрузка СПГ', colors.ALGKSPG.Statusbit.actNorm),
            RDYRUN_EO_Rdy       :   defineCLR('RDYRUN_EO_Rdy', '', colors.ALGKSPG.Statusbit.actNorm),
            RDYRUN_LPUMG_Rdy    :   defineCLR('RDYRUN_LPUMG_Rdy', 'Отсечные клапана 299-1, 299-1.1, 299-1.2, 299-1.3 открыты', colors.ALGKSPG.Statusbit.actWrn),
            
            //Пуск и работа
            RUN_GPES_Rdy        :   defineCLR('RUN_GPES_Rdy', '', colors.ALGKSPG.Statusbit.actNorm),
            RUN_GPES_RdyLoad    :   defineCLR('RUN_GPES_RdyLoad', '', colors.ALGKSPG.Statusbit.actNorm),
            RUN_GPES_Stop       :   defineCLR('RUN_GPES_Stop', '', colors.ALGKSPG.Statusbit.actWrn),
            RUN_LT_9NN          :   defineCLR('RUN_LT_9NN', '', colors.ALGKSPG.Statusbit.actNorm),
            RUN_CheckZRA        :   defineCLR('RUN_CheckZRA', '', colors.ALGKSPG.Statusbit.actNorm),
            RUN_PermReg         :   defineCLR('RUN_PermReg', '', colors.ALGKSPG.Statusbit.actNorm)
        }
    }


//#region PublishFunctions

    publish_updateState(object, prefix) {
        if (!object.observerAction) {
            object.observerAction = publisher.register([this.statePath
                                                    ],
                (newValue) => {this.updateState(newValue.value, newValue.quality, newValue.tag, prefix, this, object)})
            }
        else {}
    }

//#endregion

//#region PopupFunctions
    //обновление текста инициализации при изменении качества state
    updatePopupText(quality) {
        if (quality) {
            this.initialize();
        }
        else {
            title.access.setStringValue('?????????????????????????????????????????????????????????', "Text");
            subtitle.access.setStringValue('????????????????????????????????????????????????????????', "Text");
        }
    }

    //состояние
    updateState(value, quality, state, prefix, context, object) {
        if(quality) {
            let color = context.processStatusBits();
            RGBAColoring(object.indicator, color[prefix].clr, "FillColor")
            object.text.setStringValue(color[prefix].descr, "Text")
            RGBAColoring(object.text, colors.SERVICE.Goodqual.text, "TextColor")
        }
        else {
            RGBAColoring(object.indicator, colors.SERVICE.Badqual.field, "FillColor")
            RGBAColoring(object.text, colors.SERVICE.Badqual.text, "TextColor")
        }
    }


//#endregion
}
    
    

