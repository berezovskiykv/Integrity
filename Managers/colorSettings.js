#ONCE_EXECUTION_BEGIN
    // Открытие файла json и преобразование его в объект
    jsonStringColors = environment.readFile(environment.projectDir() + "/scripts/Managers/colors.json", "UTF-8");
    colorsList = JSON.parse(jsonStringColors);

    colors = setupColors();
    //Названия цветов в colors.json именованы с default color list [https://colornamer.robertcooper.me]. Давайте не будем придумывать свои названия!

#ONCE_EXECUTION_END

function setupColors() {
    return {
        AP : {
            Fillvalue : {
                invalid : colorsList.AQUA,          
                alarm   : colorsList.RED,           
                warn    : colorsList.YELLOW,
                norm    : colorsList.SNOWFLAKE,
                kvit    : colorsList.MAROON
            },
            Fillstate : {
                mask    : colorsList.grayDarkColor,
                imit    : colorsList.DRIED_MAGENTA,
                test    : colorsList.ORANGE_JUICE,
                field   : colorsList.TIN_SOLDIER
            },
            Text : {
                default : colorsList.BAUHAUS,
                alarm   : colorsList.WHITE,
                kvit    : colorsList.WHITE,
                yell    : colorsList.yellowColor
            },

            Mode : {
                flt     : colorsList.RED
            },
            TextPopup : {
                default : colorsList.BAUHAUS,
                imit    : colorsList.DRIED_MAGENTA,
                test    : colorsList.ORANGE_JUICE
            },
            ScalePopup : {
                default : colorsList.AMAZON_PARROT,
                invalid : colorsList.AQUA,
                alarm   : colorsList.RED,
                warn    : colorsList.YELLOW,
                Badqual : colorsList.GREY
            },
            Flt :  {
                act     : colorsList.RED,
                inact   : colorsList.CAPE_HOPE,
            },

            SimCol : {
                redCol  : colorsList.redSimColor,
                peachCol: colorsList.orangeColor,
                yellCol : colorsList.yellowAPColor,
                whiteCol: colorsList.WHITE,
                blackCol: colorsList.BLACK,
                grayCol : colorsList.grayDarkColor,
                grCol   : colorsList.grayTextColor,
                backCol : colorsList.BackSimColor,
                greenCol: colorsList.greenColor,
                greenlightCol: colorsList.greenLightColor,
                kvit    : colorsList.greyInvalidColor
            },

            SimCol_back : {
                redCol_back   : colorsList.redColor2,
                yellCol_back  : colorsList.yellowColor2,
                whiteCol_back : colorsList.whiteColor,
                grayCol_back  : colorsList.grayDarkColor,
                grCol_back    : colorsList.grayTextColor,
                greenCol_back : colorsList.greenColor2,
                peachCol_back : colorsList.orangeColor2,
                kvit_back     : colorsList.defaultTextColor
            },
            Stroke : {

            }, 
            ProgressBar : {

            }
        },


        DP : {
            Fillstate : {
                imit        : colorsList.DRIED_MAGENTA,
                test        : colorsList.ORANGE_JUICE,
                field       : colorsList.TIN_SOLDIER,
                kvit        : colorsList.MAROON,
                actAlarm    : colorsList.RED,
                actWrn      : colorsList.YELLOW,
                actInf      : colorsList.AMAZON_PARROT,
                inact       : colorsList.WHITE,
                norm        : colorsList.TIN_SOLDIER,
                invalid     : colorsList.AQUA,
                default     : colorsList.GREY,
                act1        : colorsList.RED,
                act2        : colorsList.YELLOW,
                act3        : colorsList.PASTEL_GREEN,
            },

            Flt :  {
                act     : colorsList.RED,
                inact   : colorsList.CAPE_HOPE
            },

            SimCol : {
                redCol  : colorsList.redSimColor,
                peachCol: colorsList.PeachPuffSimColor,
                yellCol : colorsList.yellowAPColor,
                whiteCol: colorsList.WHITE,
                blackCol: colorsList.BLACK,
                grayCol : colorsList.grayDarkColor,
                backCol : colorsList.BackSimColor,
                greenCol: colorsList.greenColor,
                kvit    : colorsList.greyInvalidColor
            },

            SimCol_back : {
                redCol_back   : colorsList.redColor2,
                yellCol_back  : colorsList.yellowColor2,
                whiteCol_back : colorsList.whiteColor,
                grayCol_back  : colorsList.grayDarkColor,
                greenCol_back : colorsList.greenColor2,
                kvit_back     : colorsList.defaultTextColor
            }

        },

         SIR : {
            Fillstate : {
                imit    : colorsList.DRIED_MAGENTA,
                bad     : colorsList.BLACK,
                act1    : colorsList.RED,
                act2    : colorsList.YELLOW,
                act3    : colorsList.greenColor,
                act4    : colorsList.grayDarkColor,
                field   : colorsList.TIN_SOLDIER,
                flt     : colorsList.RED,
                kvit    : colorsList.greyInvalidColor,
                on      : colorsList.PASTEL_GREEN,
                off     : colorsList.TIN_SOLDIER,
                invalid : colorsList.AQUA 
            },
            Backstate : {
                bad_back     : colorsList.whiteColor,
                act1_back    : colorsList.redColor2,
                act2_back    : colorsList.yellowColor2,
                act3_back    : colorsList.greenColor2,
                act4_back    : colorsList.whiteColor,
                field        : colorsList.TIN_SOLDIER,
                flt_back     : colorsList.redColor2,
                kvit_back     : colorsList.defaultTextColor
            }

        },
         VLV : {
            Fillstate : {
                imit    : colorsList.DRIED_MAGENTA,
                field   : colorsList.TIN_SOLDIER,
                kvit    : colorsList.MAROON,
                invalid : colorsList.AQUA, 
                open    : colorsList.PASTEL_GREEN,
                close   : colorsList.YELLOW,
                avar    : colorsList.RED,
                middle1 : colorsList.PASTEL_GREEN,
                middle2 : colorsList.YELLOW
            },
            Modestate : {
                auto  : colorsList.WHITE,
                local : colorsList.YELLOW,
                man  : colorsList.AQUA
            },
            SimCol : {
                err  : colorsList.grayDarkColor2,
                Close: colorsList.Scarlet,
                Open : colorsList.IndicGreen,
                Middle: colorsList.greyInvalidColor,
                blackCol: colorsList.BLACK
            }

        },

        VLVP : {
            treanglestate1 : {
                field     : colorsList.TIN_SOLDIER, 
                close     : colorsList.treangle1_close,
                closing   : colorsList.treangle1_closing,
                opening   : colorsList.treangle1_opening,
                middle    : colorsList.treangle1_middle,
                open      : colorsList.treangle1_open,
                err       : colorsList.treangle1_err,

            },
            treanglestate2 : {
                field   : colorsList.TIN_SOLDIER,
                close     : colorsList.treangle2_close,
                closing   : colorsList.treangle2_closing,
                opening   : colorsList.treangle2_opening,
                middle    : colorsList.treangle2_middle,
                open      : colorsList.treangle2_open,
                err       : colorsList.treangle2_err,
            },
    
            treanglestate1_back : {
                field     : colorsList.TIN_SOLDIER, 
                close     : colorsList.treangle1_close_back,
                closing   : colorsList.treangle1_closing_back,
                opening   : colorsList.treangle1_opening_back,
                middle    : colorsList.treangle1_middle_back,
                open      : colorsList.treangle1_open_back,
                err       : colorsList.treangle1_err_back,

            },
            treanglestate2_back : {
                field     : colorsList.TIN_SOLDIER,
                close     : colorsList.treangle2_close_back,
                closing   : colorsList.treangle2_closing_back,
                opening   : colorsList.treangle2_opening_back,
                middle    : colorsList.treangle2_middle_back,
                open      : colorsList.treangle2_open_back,
                err       : colorsList.treangle2_err_back,
            },

            SimCol : {
                redCol  : colorsList.redSimColor,
                yellCol : colorsList.yellowAPColor,
                whiteCol: colorsList.WHITE,
                blackCol: colorsList.BLACK,
                grayCol : colorsList.grayDarkColor,
                backCol : colorsList.BackSimColor,
                greenCol: colorsList.greenColor,
                kvit    : colorsList.greyInvalidColor
            },

            SimCol_back : {
                redCol_back   : colorsList.redColor2,
                yellCol_back  : colorsList.yellowColor2,
                whiteCol_back : colorsList.whiteColor,
                grayCol_back  : colorsList.grayDarkColor,
                greenCol_back : colorsList.greenColor2,
                kvit_back     : colorsList.defaultTextColor
            }
        },

        AGT : {
            Fillstate : {
                mask    : colorsList.ROOKWOOD_ANTIQUE_GOLD,
                imit    : colorsList.DRIED_MAGENTA,
                field   : colorsList.TIN_SOLDIER,
                kvit    : colorsList.MAROON,
                invalid : colorsList.AQUA, 
                start   : colorsList.AMAZON_PARROT,
                stop    : colorsList.YELLOW,
                avar    : colorsList.RED,
                middle1 : colorsList.AMAZON_PARROT,
                middle2 : colorsList.YELLOW
            },
             Indicatorstate : {
                RDYStart  : colorsList.WHITE,
                RDYStop   : colorsList.BLACK,
                avar      : colorsList.RED
            },
            Modestate : {
                mask  : colorsList.ROOKWOOD_ANTIQUE_GOLD,
                auto  : colorsList.WHITE,
                local : colorsList.YELLOW,
                man   : colorsList.AQUA
            }

        },
        DIAG : {
            Mod64Io: {
                Green : colorsList.TIN_SOLDIER,
                Gray  : colorsList.grayDarkColor  
            }    
        },

        ElemAP : {
            Fillstate : {
                field   : colorsList.TIN_SOLDIER,
                link    : colorsList.PASTEL_GREEN,
                avar    : colorsList.RED,
            },

            Fillsetpoint : {
                hi      : colorsList.YELLOW,
                hihi    : colorsList.RED,
                lo      : colorsList.YELLOW,
                lolo    : colorsList.RED,
            },
            Fillsetpoint_back : {
                hi      : colorsList.HILO_BACK,
                hihi    : colorsList.HIHILOLO_BACK,
                lo      : colorsList.HILO_BACK,
                lolo    : colorsList.HIHILOLO_BACK,
            }
        },
        ElemVLV : {
            Fillstate_treangle1 : {
                field   : colorsList.FIELD,
                err     : colorsList.ERR,
                stop    : colorsList.CLOSE,
                stoping : colorsList.CLOSING,
                opening : colorsList.OPENING,
                open    : colorsList.OPEN,
                middle  : colorsList.BLACK
            },
            Fillstate_treangle2 : {
                field   : colorsList.FIELD,
                err     : colorsList.ERR,
                stop    : colorsList.CLOSE,
                open    : colorsList.OPEN,
                middle  : colorsList.BLACK
            },
            Fillback_treangle1 : {
                field_back   : colorsList.FIELD_BACK,
                err_back    : colorsList.ERR_BACK,
                stop_back    : colorsList.STOP_BACK,
                open_back    : colorsList.OPEN_BACK,
                middle_back  : colorsList.MIDDLE_BACK
            },
            Fillback_treangle2 : {
                field_back   : colorsList.FIELD_BACK,
                err_back    : colorsList.ERR_BACK,
                stop_back    : colorsList.STOP_BACK,
                open_back    : colorsList.OPEN_BACK,
                middle_back  : colorsList.MIDDLE_BACK
            }
        },

        ElemAT : {
            Fillstate : {
                normal   : colorsList.WHITE,
                default  : colorsList.ELEMAT_DEF
            }
        },

        ElemAGT : {
            Fillstate : {
                field   : colorsList.FIELD,
                start   : colorsList.OPEN,
                open    : colorsList.OPEN,
                middle  : colorsList.BLACK,
                stop    : colorsList.CLOSE,
            },
            Fillstate_back : {
                field_back   : colorsList.FIELD_BACK,
                open_back   : colorsList.OPEN_BACK,
                start_back   : colorsList.OPEN_BACK,
                middle_back  : colorsList.MIDDLE_BACK,
                stop_back    : colorsList.STOP_BACK,
            },
            Ind : {
                field   : colorsList.FIELD,
                ready   : colorsList.OPEN,
                noready : colorsList.CLOSE,
            },
            Ind_back: {
                field_back   : colorsList.FIELD_BACK,
                ready_back   : colorsList.OPEN_BACK,
                noready_back : colorsList.STOP_BACK
            }
        },

        PID : {
            Fillstate : {
                field      : colorsList.FRAME,
                disable    : colorsList.DISABLE,
            }

        },


        ElemTS : {
            Fillstate : {
                bad        : colorsList.BAD,
                main1      : colorsList.MAIN1,
                back1      : colorsList.MAIN1_BACK,
                main2      : colorsList.MAIN2,
                back2      : colorsList.MAIN2_BACK,
                main3      : colorsList.MAIN3,
                back3      : colorsList.MAIN3_BACK,
                kvit       : colorsList.WHITE,
                kvit_back  : colorsList.WHITE,
            }
        },

        LS : {

        },

        CE : {
            darkBackgroundColor :   colorsList.darkBackgroundColor,
            redColor            :   colorsList.redColor,
            warn                :   colorsList.yellowColor,
            brownColor          :   colorsList.brownColor,
            invisible           :   colorsList.INVISIBLE,
            white               :   colorsList.WHITE,
            inact               :   colorsList.CEINACT

        },

         DIAG : {
            state : {
                alm    : colorsList.RED,
                wrn     : colorsList.YELLOW,
                inf     : colorsList.FOREST_RIDE,
                dp      : colorsList.GREEN,
                testing : colorsList.ORANGE_JUICE,
                text    : colorsList.BAUHAUS,
            },
            lines:{
                line1   : colorsList.CAPE_HOPE, 
                line2   : colorsList.SILVERBACK,
                buttonLine: colorsList.WHITE,
                buttonFill: colorsList.TOMB_BLUE,
            },
            PLCState : {
                actField     : colorsList.AMAZON_PARROT,
                actText      : colorsList.BAUHAUS,
                resField     : colorsList.BLUE,
                resText      : colorsList.WHITE,
                almField     : colorsList.RED,
                almText      : colorsList.WHITE,
                defField : colorsList.TIN_SOLDIER,
                defText  : colorsList.BAUHAUS
            }
        },
        EO : { 
            State : {
                no_front : colorsList.BLUE,
                no_back : colorsList.SUPERIOR_BLUE,
                on_front : colorsList.RED,
                on_back : colorsList.OXFORD_BRICK,
                off_front : colorsList.GREEN,
                off_back : colorsList.CUCUMBER_QUEEN,
                inact_front : colorsList.WHITE,
                inact_back : colorsList.SILVER_MEDAL,
                ready_front : colorsList.YELLOW,
                ready_back : colorsList.RELENTLESS_OLIVE
            }
        },
        ALGKSPG : {
            State : {
                AOfield : colorsList.RED,
                AOtext : colorsList.WHITE,
                NOfield : colorsList.YELLOW,
                NOtext  : colorsList.BAUHAUS,
                RUNfield : colorsList.AMAZON_PARROT,
                RUNtext : colorsList.BAUHAUS,
                RDYRUNfield : colorsList.AMAZON_PARROT,
                RDYRUNtext  : colorsList.BAUHAUS,
                defaultfieldClr : colorsList.SNOWFLAKE,
                defaulttextClr  : colorsList.BAUHAUS
            },
            Statusbit : {
                actAlm  : colorsList.RED,
                actWrn  : colorsList.YELLOW,
                actNorm : colorsList.GREEN,
                inact   : colorsList.CAPE_HOPE
            }
        },

        Block : {
            State : {
                alm   : colorsList.RED,
                wrn   : colorsList.YELLOW,
                inf   : colorsList.PASTEL_GREEN,
                good  : colorsList.TOMB_BLUE,
        },
    },

        Link : {
            state : {
                act : colorsList.LINK,
                inact : colorsList.RED,
                bad : colorsList.grayDarkColor,
        
            },
         
        },
        SERVICE : {
            Frame : {   //рамка на всех кликабельных элементах
                set     : colorsList.BAUHAUS,
                reset   : colorsList.INVISIBLE
            },
            Sets : {    //цветa фона уставок при изменении качества
                Good : colorsList.SNOWFLAKE, //
                inact: colorsList.CAPE_HOPE, //неактивные уставки
                Bad : colorsList.TIN_SOLDIER
            },
            inputWindow : { //неактивная кнопка точки в inputwindow
                noDot : colorsList.GREY
            },
            Badqual : { //цвета при плохом качестве (радиобаттоны и чекбоксы)
                field : colorsList.TIN_SOLDIER,
                text : colorsList.GREY
            },
            Goodqual : { //цвета при хорошем качестве (радиобаттоны и чекбоксы)
                field : colorsList.WHITE,
                text  : colorsList.BLACK,
                field_act: colorsList.SILVER_MEDAL
            },
            buttons : {
                act    : colorsList.TOMB_BLUE,
                inact  : colorsList.TIN_SOLDIER,
                default: colorsList.BLUEGRAY
            },
            Popup : {   //дефолтный темно серый цвет заголовков блоков в попапе
                headDEF  : colorsList.GREY
            },
            Flt : { //цвет аварий в попапе
                actAlm  : colorsList.RED,
                actWrn  : colorsList.YELLOW,
                inact   :  colorsList.CAPE_HOPE,
                actinf  :  colorsList.GREEN,
                actMask : colorsList.BROWN,
            },
            NavBtn : {
                act : colorsList.KEY_WEST_ZENITH,
                inact : colorsList.BRAINSTEM_GREY
            }
        }

    }
}
