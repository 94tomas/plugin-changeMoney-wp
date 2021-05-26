Vue.config.productionTip = false
Vue.component('money-changer', {
    data() {
        return {
            primary: '#51bbac',
            url: 'http://facturacion.macsystem.com.pe/api/tipo-cambio',
            date: '2021-01-20',
            typeMoney: '',
            coupon: '',
            initialOperation: '/',
            stringList: ``,
            listDot: [],
            show: true,
            updateBox: 20,
            couponMsgOk: 'El cupón ha sido reconocido correctamente.',
            couponMsgError: 'El cupón no ha sido reconocido. Por favor verifica que el código ingresado sea el correcto.',
            // data other
            toggle: true,
            isActive: 'compra',
            cotizacionCompra: 0,
            cotizacionVenta: 0,
            send: 0,
            get: 0,
            cotizacionVentaBanco: 0,
            cotizacionCompraBanco: 0,
            activeChange: 'send',
            saveMoney: 0,
            msgSuccess: false,
            msgError: false,
            tmpCurrentMoney: ['2', '3'],
            tmpAbrMoney: 'US$',
            tmpAuxMoney: 'Dólares'
        }
    },
    props: ['wpcolor', 'wpurl', 'wptime', 'wptype', 'wplist', 'wpbtn', 'wpok', 'wperror'],
    mounted() {
        if (this.wpurl == '') {
            this.show = false
        }
        this.primary = this.wpcolor;
        this.url = this.wpurl;
        this.updateBox = +this.wptime;
        var d = new Date();
        const tmpD = (d.getFullYear()).toString() +'-'+ (d.getMonth()+1).toString() +'-'+ (d.getDate()).toString()
        this.date = tmpD;
        this.tmpCurrentMoney = JSON.parse(this.wptype)
        this.stringList = this.wplist
        this.initialOperation = this.wpbtn
        if (this.wpok !== '') this.couponMsgOk = this.wpok
        if (this.wperror) this.couponMsgError = this.wperror
        this.selectTypeMoney(this.tmpCurrentMoney[0])
        // this.callApiMoneyChanger()
        setInterval(() => {
            this.callApiMoneyChanger()
        }, this.updateBox * 60 * 1000);
        this.generateList()
    },
    methods: {
        callApiMoneyChanger() {
            const tmpUrl = this.url.split('/')
            if (tmpUrl[tmpUrl.length - 1] !== '') this.url = this.url+'/'
            fetch(`${this.url}${this.date}/${this.typeMoney}${(this.coupon !== '') ? '/'+this.coupon : ''}`, {
                // 'mode': 'no-cors',
                'headers': {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            },
            )
            .then(async response => {
                // console.log(response)
                const data = await response.json()
                if (this.coupon !== '') {
                    if (data.estado) {
                        this.msgError = false
                        this.msgSuccess = true
                        this.selectTypeMoney(data.idmoneda.toString())
                    } else {
                        this.msgSuccess = false
                        this.msgError = true
                        return
                    }
                } else {
                    this.msgError = false
                    this.msgSuccess = false
                }
                
                this.cotizacionCompra = +data.cotizacioncompra
                this.cotizacionVenta = +data.cotizacionventa
                this.send = 1000
                // this.get = (this.cotizacionCompra * this.send).toFixed(2)
                // banco
                this.cotizacionVentaBanco = +data.cotizacion_venta_banco
                this.cotizacionCompraBanco = +data.cotizacion_compra_banco
                // calculation
                if (this.activeChange === 'send') this.changeMoneyInputSend()
                else if(this.activeChange === 'get') this.changeMoneyInputGet()
            })
            .catch(error => {
                console.log(error)
            })
        },
        changeMoneySend() {
            this.changeMoneyInputSend()
            this.activeChange = 'send'
        },
        changeMoneyGet() {
            this.changeMoneyInputGet()
            this.activeChange = 'get'
        },
        btnToggleMoney() {
            this.toggle = !this.toggle
            if (this.isActive == 'compra') this.isActive = 'venta'
            else if (this.isActive == 'venta') this.isActive = 'compra'
            
            if (this.activeChange === 'send') this.changeMoneyInputSend()
            else if(this.activeChange === 'get') this.changeMoneyInputGet()
        },
        selectTab(tab) {
            if (tab !== this.isActive) {
                this.isActive = tab
                this.toggle = !this.toggle
                if (this.activeChange === 'send') this.changeMoneyInputSend()
                else if(this.activeChange === 'get') this.changeMoneyInputGet()
            }
        },
        changeMoneyInputSend() {
            if (this.isActive == 'venta') {
                this.get = (this.send / this.cotizacionVenta).toFixed(2)
                this.saveMoney = ((this.send / this.cotizacionVentaBanco) - (this.send / this.cotizacionVenta)).toFixed(2)
                if (+this.saveMoney <= 0) {
                    this.saveMoney = (+this.saveMoney * -1).toFixed(2)
                }
            }
            else if(this.isActive == 'compra') {
                this.get = (this.cotizacionCompra * this.send).toFixed(2)
                this.saveMoney = ((this.cotizacionCompra * this.send) - (this.send * this.cotizacionCompraBanco)).toFixed(2)
                if (+this.saveMoney <= 0) {
                    this.saveMoney = (+this.saveMoney * -1).toFixed(2)
                }
            }
        },
        changeMoneyInputGet() {
            if (this.isActive == 'compra') {
                this.send = (this.get / this.cotizacionCompra).toFixed(2)
                this.saveMoney = ((this.cotizacionCompra * this.send) - (this.send * this.cotizacionCompraBanco)).toFixed(2)
                if (+this.saveMoney <= 0) {
                    this.saveMoney = (+this.saveMoney * -1).toFixed(2)
                }
            }
            else if(this.isActive == 'venta') {
                this.send = (this.cotizacionVenta * this.get).toFixed(2)
                this.saveMoney = ((this.send / this.cotizacionVentaBanco) - (this.send / this.cotizacionVenta)).toFixed(2)
                if (+this.saveMoney <= 0) {
                    this.saveMoney = (+this.saveMoney * -1).toFixed(2)
                }
            }
        },
        // generate list
        generateList() {
            this.stringList = this.stringList.replace(/(\r\n|\n|\r)/gm, '')
            const tmpList = this.stringList.split('-')
            tmpList.forEach(element => {
                if (element != '') {
                    const tmpTool = element.split('#')
                    if (tmpTool.length > 1) {
                        this.listDot.push({
                            text: tmpTool[0].trim(),
                            tooltip: tmpTool[1].trim()
                        })
                    } else {
                        this.listDot.push({
                            text: tmpTool[0].trim(),
                            tooltip: ''
                        })
                    }
                }
            });
        },
        // simulate
        changeVal() {
            if (this.coupon == '') {
                this.callApiMoneyChanger()
            }
        },
        simulateCode() {
            if (this.coupon !== '') {
                this.callApiMoneyChanger()
            }
        },
        // change type money
        selectTypeMoney(val) {
            if (val !== this.typeMoney) {
                switch (val) {
                    case '2':
                        this.tmpAbrMoney = 'US$'
                        this.tmpAuxMoney = 'Dólares'
                        break;
                    case '3':
                        this.tmpAbrMoney = 'EUR'
                        this.tmpAuxMoney = 'Euro'
                        break
                    case '4':
                        this.tmpAbrMoney = 'Otr'
                        this.tmpAuxMoney = 'Otro'
                        break
                    default:
                        break;
                }
                this.typeMoney = val
                this.callApiMoneyChanger()
            }
        },
        startOperation() {
            window.location.href = this.initialOperation
        }
    },
    template: `
        <div class="e-content" v-if="show">
            <div class="e-nav e-row e-mb-15">
                <div class="e-col"
                    :class="(tmpCurrentMoney.length==1) ? 'e-col-12' : (tmpCurrentMoney.length==3) ? 'e-col-4' : ''"
                    v-for="(t, index) in tmpCurrentMoney"
                    :key="index"
                >
                    <button
                        @click="selectTypeMoney(t)"
                        :class="(typeMoney == t)?'active':''" 
                        :style="{ color: (typeMoney == t)?'white !important':'', background: (typeMoney == t)?primary+' !important':'', borderBottom: '2px solid '+primary }"
                    >
                        {{ (t == '2') ? 'Dólares' : (t == '3') ? 'Euros' : 'Otro' }}
                    </button>
                </div>
                <!-- <div class="e-col e-col-4">
                    <a href="javascript:;" @click="selectTypeMoney('2')" :class="(typeMoney == '2')?'active':''" :style="{ background: (typeMoney == '2')?primary:'', borderBottom: '2px solid '+primary }">
                        Dólares
                    </a>
                </div>
                <div class="e-col e-col-4">
                    <a href="javascript:;" @click="selectTypeMoney('3')" :class="(typeMoney == '3')?'active':''" :style="{ background: (typeMoney == '3')?primary:'', borderBottom: '2px solid '+primary }">
                        Euros
                    </a>
                </div>
                <div class="e-col e-col-4">
                    <a href="javascript:;" @click="selectTypeMoney('4')" :class="(typeMoney == '4')?'active':''" :style="{ background: (typeMoney == '4')?primary:'', borderBottom: '2px solid '+primary }">
                        Otro
                    </a>
                </div> -->
            </div>
            <div class="e-header e-row e-mb-25">
                <div class="e-col">
                    <div class="e-a" @click="selectTab('compra')" :class="(isActive == 'compra') ? 'active' : ''" :style="{ borderColor: (isActive == 'compra') ? primary : '' }">
                        Compramos {{ tmpAbrMoney }} <br>
                        S/{{ cotizacionCompra.toFixed(4) }}
                    </div>
                </div>
                <div class="e-col">
                    <div class="e-a" @click="selectTab('venta')" :class="(isActive == 'venta') ? 'active' : ''" :style="{ borderColor: (isActive == 'venta') ? primary : '' }">
                        Vendemos {{ tmpAbrMoney }} <br>
                        S/{{ cotizacionVenta.toFixed(4) }}
                    </div>
                </div>
            </div>
            <div class="e-wrap e-mb-15">
                <div class="e-group">
                    <div class="e-input">
                        <label for="send">Envías</label>
                        <input type="text" name="send" v-model="send" @input.prevent="changeMoneySend">
                    </div>
                    <div class="e-append" :style="{ backgroundColor: primary }">
                        {{ (isActive == 'compra') ? tmpAuxMoney : 'Soles' }}
                    </div>
                </div>
                <div class="e-wrap-btn">
                    <button @click="btnToggleMoney">
                        <svg style="width:35px;height:35px" viewBox="0 0 24 24" :style="{ transform: (toggle) ? 'rotate(90deg)' : 'rotate(270deg)' }">
                            <path fill="currentColor" d="M19,8L15,12H18A6,6 0 0,1 12,18C11,18 10.03,17.75 9.2,17.3L7.74,18.76C8.97,19.54 10.43,20 12,20A8,8 0 0,0 20,12H23M6,12A6,6 0 0,1 12,6C13,6 13.97,6.25 14.8,6.7L16.26,5.24C15.03,4.46 13.57,4 12,4A8,8 0 0,0 4,12H1L5,16L9,12" />
                        </svg>
                    </button>
                </div>
                <div class="e-group">
                    <div class="e-input">
                        <label for="get">Recibes</label>
                        <input type="text" name="get" v-model="get" @input.prevent="changeMoneyGet">
                    </div>
                    <div class="e-append" :style="{ backgroundColor: primary }">
                        {{ (isActive == 'venta') ? tmpAuxMoney : 'Soles' }}
                    </div>
                </div>
            </div>
            <div class="e-wrap">
                <div class="e-mb-10 e-text-center" :style="{color: primary}">
                    <small>
                        Ahorras <strong style="font-weight: 900;">{{ (isActive == 'compra') ? 'S/' : tmpAbrMoney }} {{ saveMoney }}</strong> vs los bancos
                        <div class="e-tooltip" :style="{color: primary}">
                            <svg style="width:20px;height:20px" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z" />
                            </svg>
                            <div class="e-tooltip-body">
                                Tipo de cambio Promedio: S/{{ (isActive == 'compra') ? cotizacionCompraBanco.toFixed(4) : cotizacionVentaBanco.toFixed(4) }}
                            </div>
                        </div>
                    </small>
                </div>
                <div class="e-custom-input e-mb-15">
                    <input type="text" v-model="coupon" @input="changeVal" placeholder="¿Si tienes un cupón? ingrésalo" :style="{borderColor: primary}">
                    <div class="btn-append">
                        <button @click="simulateCode" :style="{ background: primary+' !important' }">Simular</button>
                    </div>
                </div>
                <div class="e-alert e-mb-15 success" v-if="msgSuccess">
                    <div class="e-icon">
                        <svg style="width:25px;height:28px" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2,4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z" />
                        </svg>
                    </div>
                    {{ couponMsgOk }}
                    <button class="e-btn-closed" @click="msgSuccess = false">×</button>
                </div>
                <div class="e-alert e-mb-15 error" v-if="msgError">
                    <div class="e-icon">
                        <svg style="width:50px;height:25px" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
                        </svg>
                    </div>
                    {{ couponMsgError }}
                    <button class="e-btn-closed" @click="msgError = false">×</button>
                </div>
                <div class="e-mb-15">
                    <button @click="startOperation" class="e-btn" :style="{ background: primary+' !important' }">
                        Iniciar operación
                        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                        </svg>
                    </button>
                </div>
                <ul class="e-list">
                    <li v-for="(item, index) in listDot" :key="index" :style="{ color: primary }">
                        {{ item.text }}
                        <div class="e-tooltip" :style="{color: primary}" v-if="item.tooltip !== ''">
                            <svg style="width:20px;height:20px" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z" />
                            </svg>
                            <div class="e-tooltip-body">
                                {{ item.tooltip }}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    `
})

var app = new Vue({
    el: '#app'
})
