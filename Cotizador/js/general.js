$(document).ready(function(){

    $("#menuRamos li").click( function() {
        //alert($(this).text());
        
        $("#nombreRamo").text($(this).text());
    });
    
    $("#btn_calcular").click( function() {
        //event.preventDefault();
        var nclientes;
        var vfinanciado;
        var tasa_efectiva;
        var dividendo;
        var i;
        var suma_interes;
        var tasa_riesgo
        var impsuper;
        var datosgrid;
        var datostabla;
        var saldo;
        var intereses;
        var numero;
        var dias;
        var meses;
        var anios;

        
        $("#tasaBeneficioClienteCol").val($("#tasaBeneficioCliente").val());
        $("#tasaBeneficioClienteInd").val($("#tasaBeneficioCliente").val());
        

        var hoyTemp = new Date();
        var diaTemp = hoyTemp.getDate();
        var mesTemp = hoyTemp.getMonth()+1;
        var anioTemp = hoyTemp.getFullYear();
        var fecha_actualStr = String(diaTemp+"/"+mesTemp+"/"+anioTemp);
        var fecha_actualDate = new Date(fecha_actualStr);

        var f = fecha_actualDate;
        var sumarDias=parseInt(30);
        var fecha=fecha_actualStr;
        
        var constFecha = fecha;

        //grupo para vaciar los divs donde se despliega las tablas.
        /*$('#JTPanel1').empty();
        $('#JTPanel2').empty();
        $('#JTPanel3').empty();
        $('#JTPanel4').empty();
        $('#JTPanel5').empty();
        $('#pn_resumen').empty();*/

        suma_interes = 0;
        nclientes = parseInt($('#numClientes').val());
        //aqui se multiplica el valor a financiar por los usuarios... no se donde se utiliza este valor, pero NO borrar
        vfinanciado = parseFloat($('#valorAsegurado').val())*nclientes;
        tasa_efectiva = Math.round(((Math.pow(1 + (parseFloat($('#tasaFinanciamiento').val())/100)/12,12)-1)*100)*100)/100;
        dividendo = vfinanciado / (parseInt($('#anios').val())*12);

        tasaInterna = parseFloat($('#tasaSeguro').val());

        //superbancos = parseFloat($('#ed_impsuper').val());
        superbancos = 3.5;

        saldo = vfinanciado;

        if(vfinanciado>0)
        {
            $('#ed_total').val(((vfinanciado)*nclientes).toFixed(2));
            //$('#ed_total').val(((vfinanciado)).toFixed(2));

            //calculo de valor diferencial y rendimiento en DATOS
            diferencialCalculado = parseFloat($('#tasaFinanciado').val()) - parseFloat(tasaInterna);
            rendimientoCalculado = diferencialCalculado / parseFloat($('#tasaFinanciado').val()) * 100;
            $("#diferencialCalculado").val(parseFloat(diferencialCalculado).toFixed(2));
            $("#rendimientoCalculado").val(parseFloat(rendimientoCalculado).toFixed(2));
            
            //-----------------------------------------------------
            
            //calculo por anios----------------------------------------------------------------------------
            var html = '';
            var sumaseguros = 0;
            var suma_cuotas = 0;
            var tasaInterna_riesgo = 0;
            var tasaExterna_riesgo = 0;
            var sumatasariesgo = 0;
            var valorAnualSeguro = new Array();
            
            for(i = 1; i <= parseInt($('#anios').val()); i++)
            {
                var iva = 0;

                if(i==1)
                {
                    //aqui si no se desea la multiplicacion del monto por numero de usuarios
                    var financia = parseFloat(parseFloat($('#valorAsegurado').val()).toFixed(2))*nclientes;
                }
                else if(i==2)
                {
                    financia = parseFloat(parseFloat(financia*(1-(parseFloat($('#porcDepreciacion1').val())/100))).toFixed(2));
                }
                else
                {
                    financia = parseFloat(parseFloat(financia*(1-(parseFloat($('#porcDepreciacion2').val())/100))).toFixed(2));
                }

                tasa_riesgo = parseFloat(parseFloat(parseFloat(financia) * (parseFloat($('#tasaFinanciado').val())/100)).toFixed(2));
                sumatasariesgo = sumatasariesgo + tasa_riesgo;
                tasaInterna_riesgo = tasaInterna_riesgo + parseFloat(parseFloat(parseFloat(financia) * (parseFloat(tasaInterna)/100)).toFixed(2));
                tasaExterna_riesgo = tasaExterna_riesgo + tasa_riesgo;

                impsuper = parseFloat(parseFloat(parseFloat(tasa_riesgo) * (parseFloat(superbancos)/100)).toFixed(2));

                var subtotalseguro = tasa_riesgo + impsuper;

                iva = parseFloat(parseFloat(subtotalseguro * 0.14).toFixed(2));
                var totalseguro = parseFloat(subtotalseguro + iva).toFixed(2);

                sumaseguros = parseFloat(parseFloat(sumaseguros) + parseFloat(totalseguro)).toFixed(2);

                html = html + '<div class="mdl-card mdl-cell mdl-cell--6-col">';
                html = html + '<div class="mdl-card__supporting-text mdl-grid mdl-grid--no-spacing">';
                html = html + '<table border="0" style="width:100%; ">';
                html = html + '<tr>';
                html = html + '<td colspan="3" style="width:100%; text-align:center" class="mdl-color--primary-dark colorFuente"><strong>A&Ntilde;O '+i+'</strong></td>';
                html = html + '</tr>';

                /*if(i==1)
                {
                html = html + '<tr>';
                html = html + '<td colspan="2" style="width:75%; ">Valor a financiar</td>';
                html = html + '<td style="width:25%; text-align:right; ">'+parseFloat($('#ed_total').val()).toFixed(2)+'</td>';
                html = html + '</tr>';
                } */
                html = html + '<tr style="background:#F6F6F6;">';
                html = html + '<td colspan="2" style="width:75%; ">Valor Asegurado</td>';
                html = html + '<td style="width:25%; text-align:right; ">'+formato_numero(financia,2,'.',',')+'</td>';
                html = html + '</tr>';
                html = html + '<tr>';
                html = html + '<td style="width:50%; ">Tasa de riesgo (valor del seguro)</td>';
                html = html + '<td width="41" style="width:25%; text-align:right; ">&nbsp;</td>';//+formato_numero($('#tasaFinanciado').val(),2,'.',',')+'%</td>';
                html = html + '<td style="width:25%; text-align:right; ">'+formato_numero(tasa_riesgo,2,'.',',')+'</td>';
                html = html + '</tr>';
                html = html + '<tr style="background:#F6F6F6;">';
                html = html + '<td style="width:50%; ">Imp. S.B.</td>';
                html = html + '<td style="width:25%; text-align:right; ">&nbsp;</td>';//+formato_numero(superbancos,2,'.',',')+'%</td>';
                html = html + '<td style="width:25%; text-align:right; ">'+formato_numero(impsuper,2,'.',',')+'</td>';
                html = html + '</tr>';
                html = html + '<tr>';
                html = html + '<td colspan="2" style="width:75%; ">SUBTOTAL</td>';
                html = html + '<td style="width:25%; text-align:right; ">'+ formato_numero(subtotalseguro,2,'.',',') +'</td>';
                html = html + '</tr>';
                html = html + '<tr style="background:#F6F6F6;">';
                html = html + '<td style="width:50%; ">IVA</td>';
                html = html + '<td style="width:25%; text-align:right; ">&nbsp;</td>';//14%</td>';
                html = html + '<td style="width:25%; text-align:right; ">'+formato_numero(iva,2,'.',',')+'</td>';
                html = html + '</tr>';
                html = html + '<tr>';
                html = html + '<td colspan="2" style="width:75%; "><strong>Seguro a Financiar</strong></td>';
                html = html + '<td style="width:25%; text-align:right; "><strong>'+ formato_numero(totalseguro,2,'.',',') + '</strong></td>';
                html = html + '</tr>';
                html = html + '<tr>';
                html = html + '<td colspan="2" style="width:75%; color:#f00;font-size:12px;"><strong>Cuota Mensual</strong></td>';
                html = html + '<td style="width:25%; text-align:right; color:#f00;font-size:12px;"><strong>'+ formato_numero(totalseguro/12,2,'.',',') + '</strong></td>';
                html = html + '</tr>';
                html = html + '</table>';
                html = html + '</div></div>';
                
                valorAnualSeguro[i-1] = totalseguro;
            }

            if(parseInt($('#anios').val())>1)
            {
                var numanios = $('#anios').val()+' A&Ntilde;OS';
                var colorPenaliza = "color:#F00";
            }
            else
            {
                var numanios = '1 A&Ntilde;O';
                var colorPenaliza = "";
            }
            
            html = html + '<table width = "80%" border = 0 style="margin-left: auto;margin-right: auto;">';
            html = html + '<tr style="background:#F6F6F6;">';
            html = html + '<td colspan="2" style="width:75%; text-align:right; ">VALOR SEGURO SIN IMPUESTOS POR '+numanios+'</td>';
            html = html + '<td style="width:25%; text-align:right; ">' + formato_numero(sumatasariesgo,2,'.',',') + '</td>';
            html = html + '</tr>';
            html = html + '<tr>';
            html = html + '<td colspan="2" style="width:75%; text-align:right; ">VALOR SEGURO CON IMPUESTOS POR '+numanios+'</td>';
            html = html + '<td style="width:25%; text-align:right; ">' + formato_numero(sumaseguros,2,'.',',') + '</td>';
            html = html + '</tr>';
            html = html + '</table><br>';
            
            
            $('#divAnios').html(html); //este html corresponde a los Anios
            
            var cuotapromedioseguro = sumaseguros/(parseFloat($('#anios').val())*12);
            //alert(cuotapromedioseguro);
            var valorPenalizacion = 0;
            
            var cuotaPrimerAnio = formato_numero(valorAnualSeguro[0]/12,2,'.',',');;
            
            html = '';
            
            html = html + '<div class="mdl-card mdl-cell mdl-cell--12-col">';
            html = html + '<div class="mdl-card__supporting-text mdl-grid mdl-grid--no-spacing">';
            html = html + '<h5 style="text-align:left;" class="mdl-cell mdl-cell--12-col">Escenario 1: TRADICIONAL</h5>';
            html = html + '<table width="50%" border="0" style="margin-left: auto;margin-right: auto;">';
            html = html + '<tr class="mdl-color--primary-dark colorFuente">';
            html = html + '<td style="width:25%;"><div align="right"><strong>PLAZO</strong></div></td>';
            html = html + '<td style="width:20%;"><div align="right"><strong>Nº</strong></div></td>';
            html = html + '<td style="width:25%;"><div align="right"><strong>CUOTA</strong></div></td>';
            html = html + '<td style="width:30%;"><div align="right"><strong>TOTAL</strong></div></td>';
            html = html + '</tr>';
            html = html + '<tr>';
            html = html + '<td><div align="right">Año 1</div></td>';
            html = html + '<td><div align="right">12</div></td>';
            html = html + '<td><div align="right">'+cuotaPrimerAnio+'</div></td>';
            html = html + '<td><div align="right">'+formato_numero(valorAnualSeguro[0],2,'.',',')+'</div></td>';
            html = html + '</tr>';
            html = html + '<tr>';
            html = html + '<td><div align="right"></div></td>';
            html = html + '<td><div align="right"></div></td>';
            html = html + '<td><div align="right"></div></td>';
            html = html + '<td><div align="right"></div></td>';
            html = html + '</tr>';
            html = html + '<tr>';
            html = html + '<td><div align="right"></div></td>';
            html = html + '<td><div align="right"></div></td>';
            html = html + '<td><div align="right">Valor Cuota</div></td>';
            html = html + '<td><div align="right">'+cuotaPrimerAnio+'</div></td>';
            html = html + '</tr>';
            html = html + '</table>';
            html = html + '</div></div>';
            
            $('#divAnioUno').html(html); //este html corresponde a los Anio 1
            
            html = '';
            //html = html + '<table width="100%" border="0">';
                        
            for(i = 1; i <= parseInt($('#anios').val()); i++)
            {
                valorPenalizacion = parseFloat(valorAnualSeguro[i-1])-parseFloat(cuotapromedioseguro*12); 
                //alert(valorAnualSeguro[i-1]);
                if(valorPenalizacion > 0)
                {
                    var colorPenaliza = "color:#F00";
                }
                else
                {
                    var colorPenaliza = "";
                    valorPenalizacion = valorPenalizacion * -1;
                }
                html = html + '<tr>';
                html = html + '<td>A&NtildeO '+i+'</td>';
                html = html + '<td style="text-align:right;">12</td>';
                html = html + '<td style="text-align:right;">'+formato_numero(valorAnualSeguro[i-1]/12,2,'.',',') +'</td>';
                html = html + '<td style="text-align:right;">'+formato_numero(valorAnualSeguro[i-1],2,'.',',')+'</td>';
                html = html + '<td>&nbsp;</td>';
                html = html + '<td style="text-align:right;">'+i+'</td>';
                html = html + '<td style="text-align:right;">'+formato_numero(valorAnualSeguro[i-1],2,'.',',')+'</td>';
                html = html + '<td style="text-align:right;">'+formato_numero(cuotapromedioseguro*12,2,'.',',')+'</td>';
                html = html + '<td style="text-align:right;'+colorPenaliza+'">'+formato_numero(valorPenalizacion,2,'.',',')+'</td>';
                html = html + '<td style="text-align:right;'+colorPenaliza+'">'+formato_numero(valorPenalizacion,2,'.',',')+'</td>';
                html = html + '</tr>';
            }
            
            //html = html + '</table>';
            
            html = html + '<tr>';
            html = html + '<td>&nbsp;</td>';
            html = html + '<td>&nbsp;</td>';
            html = html + '<td>&nbsp;</td>';
            html = html + '<td style="text-align:right;">'+formato_numero(sumaseguros,2,'.',',')+'</td>';
            html = html + '<td>&nbsp;</td>';
            html = html + '<td style="text-align:center;">TOTALES</td>';
            html = html + '<td>&nbsp;</td>';
            html = html + '<td style="text-align:right;">'+formato_numero(sumaseguros,2,'.',',')+'</td>';
            html = html + '<td>&nbsp;</td>';
            html = html + '<td>&nbsp;</td>';
            html = html + '</tr>';
            html = html + '<tr>';
            html = html + '<td>&nbsp;</td>';
            html = html + '<td colspan="2" style="text-align:right;">Valor Cuota Promedio</td>';
            html = html + '<td style="text-align:right;color:#00AB4F;font-size:30px;"><strong>'+formato_numero(cuotapromedioseguro,2,'.',',')+'<strong></td>';
            html = html + '<td>&nbsp;</td>';
            html = html + '<td>&nbsp;</td>';
            html = html + '<td>&nbsp;</td>';
            html = html + '<td>&nbsp;</td>';
            html = html + '<td>&nbsp;</td>';
            html = html + '<td>* Valores a ser cobrados a manera de "penalización" en caso de que el cliente se retire del programa. Este cobro permitiría a la aseguradora cubrir la totalidad de la prima.</td>';
            html = html + '</tr>';
            
            var trs=$("#modelonegocio tr").length;
            var tds = 0;
            
            if(trs-2>0)
            {
                tds = trs-2;
            }
            for(var i=0;i<tds;i++){
                // Eliminamos la ultima columna
                $("#modelonegocio tr:last").remove();
            }
            
            $('#modelonegocio tr:last').after(html); //este html corresponde a los Anios en MODELO DE NEGOCIOS DE FIDELIZACION
            //alert(html);
            //--------------------------------------------------------------------------------------------

            //var total_financiado = parseFloat(parseFloat(sumaseguros*nclientes) + parseFloat($('#ed_total').val())).toFixed(2);
            var total_financiado = parseFloat(parseFloat(sumaseguros) + parseFloat($('#valorAsegurado').val())).toFixed(2);

            datosgrid = '<table width = "100%" border = 0>';
            datosgrid = datosgrid + '<tr bgcolor="#990000 "><th width = "100%"><b><font  color="white">DETALLE</font></b></th><th width = "25%"><b><font  color="white">MONTO</font></b></th></tr>';
            datosgrid = datosgrid + '<tr><td>VALOR FINANCIADO</td><td align="right">' +formato_numero($('#valorAsegurado').val(),2,'.',',') + '</td></tr>';
            //datosgrid = datosgrid + '<tr><td>VALOR CUOTA MENSUAL PROMEDIO (SIN INTERESES)</td><td align="right">' + Math.round(dividendo*nclientes*100)/100 + '</td></tr>';
            //datosgrid = datosgrid + '<tr><td>VALOR SEGURO POR '+numanios+'</td><td align="right">' + sumaseguros*nclientes + '</td></tr>';
            datosgrid = datosgrid + '<tr><td>VALOR SEGURO POR '+numanios+'</td><td align="right">' + formato_numero(sumaseguros,2,'.',',') + '</td></tr>';
            datosgrid = datosgrid + '<tr><td>TOTAL A FINANCIAR</td><td align="right">' + formato_numero(total_financiado,2,'.',',') + '</td></tr>';
            datosgrid = datosgrid + '</table>';
            $('#JTPanel1').html(datosgrid);

            //------------------------------------------------------------------------------------------------------------------------
            //tabla del monto financiado

            //tasa_riesgo = parseFloat($('#valorAsegurado').val()) * (parseFloat($('#tasaFinanciado').val())/100);
            //impsuper = parseFloat($('#valorAsegurado').val()) * (parseFloat($('#ed_impsuper').val())/1000);

            intereses = ((vfinanciado) * (parseFloat($('#ed_interes').val())/100));

            datostabla = '<table width = "100%" border = 0>';
            datostabla = datostabla + '<th width = "10%" bgcolor="#990000 "><b><font  color="white">No.</font></b></th><th class="mdl-color--primary-dark colorFuente" width = "15%"><b><font  color="white">VENCIMIENTO</font></b></th><th bgcolor="#990000 " width = "15%"><b><font  color="white">SALDO</font></b></th><th bgcolor="#990000 " width = "15%"><b><font  color="white">INTERES</font></b></th><th bgcolor="#990000 " width = "15%"><b><font  color="white">CAPITAL</font></b></th><th bgcolor="#990000 " width = "15%"><b><font color="white">DIVIDENDO</font></b></th><th bgcolor="#990000 " width = "15%"><b><font color="white">A&Ntilde;O</font></b></th></tr>';

      //alert(anio+"-"+mes+"-"+dia);

            var j = 1;
            var columnaanio = "";
            var suma_interes = 0;
            var suma_cuotas = 0;
            fecha = constFecha;
            for(i = 0; i < parseInt($('#anios').val())*12; i++)
            {
                if(i%12 == 0 && i > 11)
                {
                    j++;
                    columnaanio = '<td rowspan="12" align="center">'+(j)+'</td>';
                }
                else
                {
                    columnaanio = "";
                }

                if(i == 0)
                    var columnaanio = '<td rowspan="12" align="center">'+(j)+'</td>';
                
                
                fecha=fecha.replace("-", "/").replace("-", "/");
                fecha= new Date(fecha);
                fecha.setDate(fecha.getDate()+sumarDias);

                var anio=fecha.getFullYear();
                var mes= fecha.getMonth()+1;
                var dia= fecha.getDate();

                if(mes.toString().length<2){
                    mes="0".concat(mes);
                }

                if(dia.toString().length<2){
                    dia="0".concat(dia);
                }

                /*saldo = saldo - dividendo;
                numero = 1 + i;

                datostabla = datostabla + '<tr><td>' + numero + '</td><td align="left">' + dia+"/"+mes+"/"+anio + '</td><td align="right">' + (Math.round(saldo*100)/100).toFixed(2) + '</td><td align="right">' + (Math.round((intereses/(parseInt($('#anios').val())*12))*100)/100).toFixed(2)  + '</td><td align="right">' + (Math.round(dividendo*100)/100).toFixed(2)  + '</td><td align="right">' +  (Math.round(((intereses/(parseInt($('#anios').val())*12))+dividendo)*100)/100).toFixed(2)  + '</td>'+columnaanio+'</tr>';
                fecha = anio+"-"+mes+"-"+dia;*/

                intereses = ((vfinanciado-(dividendo*i)) * (parseFloat($('#ed_interes').val())/100))/12;
                suma_interes = suma_interes + intereses;
                saldo = saldo - dividendo;
                numero = 1 + i;

                suma_cuotas = suma_cuotas + (Math.round((intereses+dividendo)*100)/100);

                datostabla = datostabla + '<tr><td>' + numero + '</td><td align="left">' + dia+"/"+mes+"/"+anio + '</td><td align="right">' + formato_numero(Math.round(saldo*100)/100,2,'.',',') + '</td><td align="right">' + formato_numero(Math.round(intereses*100)/100,2,'.',',') + '</td><td align="right">' + formato_numero(Math.round(dividendo*100)/100,2,'.',',') + '</td><td align="right">' + formato_numero(Math.round((intereses+dividendo)*100)/100,2,'.',',') + '</td>'+ columnaanio + '</tr>';
                fecha = anio+"-"+mes+"-"+dia;
            }
            //suma_interes = Math.round(intereses*100)/100;



            //$('#ed_total').val(((vfinanciado + suma_interes + tasa_riesgo + impsuper)*nclientes).toFixed(2));
            //$('#ed_total').val(((vfinanciado)*nclientes).toFixed(2));



            datostabla = datostabla + '</table>';

            //resumen cabecera
            datostabla1 = '<table width="100%" border="0">';
            datostabla1 = datostabla1 + '<tr>';
            datostabla1 = datostabla1 + '<td style="width:30%; background-color:#990000; color:#fff; ">RESULTADOS</td>';
            datostabla1 = datostabla1 + '<td>&nbsp;</td>';
            datostabla1 = datostabla1 + '</tr>';
            datostabla1 = datostabla1 + '</table>';
            datostabla1 = datostabla1 + '<table width="100%" border="1">';
            datostabla1 = datostabla1 + '<tr>';
            datostabla1 = datostabla1 + '<td style="width:75%">TOTAL INTERESES GENERADOS POR FINANCIAMIENTO DEL CREDITO</td>';
            datostabla1 = datostabla1 + '<td style="width:25%"><div align="right">'+ formato_numero(suma_interes,2,'.',',') +'</div></td>';
            datostabla1 = datostabla1 + '</tr>';
            datostabla1 = datostabla1 + '<tr>';
            datostabla1 = datostabla1 + '<td style="width:75%">VALOR CUOTA MENSUAL PROMEDIO (CON INTERESES)</td>';
            datostabla1 = datostabla1 + '<td style="width:25%"><div align="right">'+ formato_numero(suma_cuotas/(j*12),2,'.',',') +'</div></td>';
            datostabla1 = datostabla1 + '</tr>';
            /*datostabla1 = datostabla1 + '<tr>';
            datostabla1 = datostabla1 + '<td style="width:75%">VALOR CUOTA MENSUAL PROMEDIO (CON INTERESES + CUOTA MENSUAL PROMEDIO SEGURO)</td>';
            datostabla1 = datostabla1 + '<td style="width:25%"><div align="right">'+ parseFloat(suma_cuotas/(j*12)).toFixed(2) +'</div></td>';
            datostabla1 = datostabla1 + '</tr>'; */
            datostabla1 = datostabla1 + '<tr>';
            datostabla1 = datostabla1 + '<td style="width:75%">COSTO TOTAL DE CREDITO (INCLUIDO INTERESES)</td>';
            datostabla1 = datostabla1 + '<td style="width:25%"><div align="right">'+ formato_numero(parseFloat($('#valorAsegurado').val())+parseFloat(suma_interes),2,'.',',') +'</div></td>';
            datostabla1 = datostabla1 + '</tr>';
            datostabla1 = datostabla1 + '</table>';
            datostabla1 = datostabla1 + '<br><br>';

            datostabla = datostabla1 + datostabla;

            //$('#JTPanel4').html(datostabla);
            //-----------------------------------------------------------------------------------------------------------------

            
            //div financiamiento
            //calculo por anios FINANCIAMIENTO----------------------------------------------------------------------------
            var html = '';
            var sumaseguros = 0;
            var suma_cuotas = 0;
            var tasaInterna_riesgo = 0;
            var tasaExterna_riesgo = 0;
            var sumatasariesgo = 0;
            var valorFianciadoSeguroIndividual = new Array();
            var financiaIndividual = 0;
            
            for(i = 1; i <= parseInt($('#anios').val()); i++)
            {
                var iva = 0;

                if(i==1)
                {
                    //aqui si no se desea la multiplicacion del monto por numero de usuarios
                    var financiaIndividual = parseFloat(parseFloat($('#valorAsegurado').val()).toFixed(2));//*nclientes;
                }
                else if(i==2)
                {
                    financiaIndividual = parseFloat(parseFloat(financiaIndividual*(1-(parseFloat($('#porcDepreciacion1').val())/100))).toFixed(2));
                }
                else
                {
                    financiaIndividual = parseFloat(parseFloat(financiaIndividual*(1-(parseFloat($('#porcDepreciacion2').val())/100))).toFixed(2));
                }
                //alert(financiaIndividual);
                
                tasa_riesgo = parseFloat(parseFloat(parseFloat(financiaIndividual) * (parseFloat($('#tasaFinanciado').val())/100)).toFixed(2));
                sumatasariesgo = sumatasariesgo + tasa_riesgo;
                tasaInterna_riesgo = tasaInterna_riesgo + parseFloat(parseFloat(parseFloat(financiaIndividual) * (parseFloat(tasaInterna)/100)).toFixed(2));
                tasaExterna_riesgo = tasaExterna_riesgo + tasa_riesgo;

                impsuper = parseFloat(parseFloat(parseFloat(tasa_riesgo) * (parseFloat(superbancos)/100)).toFixed(2));

                var subtotalseguro = tasa_riesgo + impsuper;

                iva = parseFloat(parseFloat(subtotalseguro * 0.14).toFixed(2));
                var totalseguro = parseFloat(subtotalseguro + iva).toFixed(2);

                sumaseguros = parseFloat(parseFloat(sumaseguros) + parseFloat(totalseguro)).toFixed(2);

                html = html + '<div class="mdl-card mdl-cell mdl-cell--6-col">';
                html = html + '<div class="mdl-card__supporting-text mdl-grid mdl-grid--no-spacing">';
                html = html + '<table border="0" style="width:100%; ">';
                html = html + '<tr>';
                html = html + '<td class="mdl-color--primary-dark colorFuente"colspan="3" style="width:100%; text-align:center"><strong><font  color="white">A&Ntilde;O '+i+'</font></strong></td>';
                html = html + '</tr>';

                /*if(i==1)
                {
                html = html + '<tr>';
                html = html + '<td colspan="2" style="width:75%; ">Valor a financiar</td>';
                html = html + '<td style="width:25%; text-align:right; ">'+parseFloat($('#ed_total').val()).toFixed(2)+'</td>';
                html = html + '</tr>';
                } */
                html = html + '<tr style="background:#F6F6F6;">';
                html = html + '<td colspan="2" style="width:75%; ">Valor Asegurado</td>';
                html = html + '<td style="width:25%; text-align:right; ">'+formato_numero(financiaIndividual,2,'.',',')+'</td>';
                html = html + '</tr>';
                html = html + '<tr>';
                html = html + '<td style="width:50%; ">Tasa de riesgo (valor del seguro)</td>';
                html = html + '<td width="41" style="width:25%; text-align:right; ">&nbsp;</td>';//+formato_numero($('#tasaFinanciado').val(),2,'.',',')+'%</td>';
                html = html + '<td style="width:25%; text-align:right; ">'+formato_numero(tasa_riesgo,2,'.',',')+'</td>';
                html = html + '</tr>';
                html = html + '<tr style="background:#F6F6F6;">';
                html = html + '<td style="width:50%; ">Imp. S.B.</td>';
                html = html + '<td style="width:25%; text-align:right; ">&nbsp;</td>';//+formato_numero(superbancos,2,'.',',')+'%</td>';
                html = html + '<td style="width:25%; text-align:right; ">'+formato_numero(impsuper,2,'.',',')+'</td>';
                html = html + '</tr>';
                html = html + '<tr>';
                html = html + '<td colspan="2" style="width:75%; ">SUBTOTAL</td>';
                html = html + '<td style="width:25%; text-align:right; ">'+ formato_numero(subtotalseguro,2,'.',',') +'</td>';
                html = html + '</tr>';
                html = html + '<tr style="background:#F6F6F6;">';
                html = html + '<td style="width:50%; ">IVA</td>';
                html = html + '<td style="width:25%; text-align:right; ">&nbsp;</td>';//14%</td>';
                html = html + '<td style="width:25%; text-align:right; ">'+formato_numero(iva,2,'.',',')+'</td>';
                html = html + '</tr>';
                html = html + '<tr>';
                html = html + '<td colspan="2" style="width:75%; "><strong>Seguro a Financiar</strong></td>';
                html = html + '<td style="width:25%; text-align:right; "><strong>'+ formato_numero(totalseguro,2,'.',',') + '</strong></td>';
                html = html + '</tr>';
                html = html + '<td colspan="2" style="width:75%; color:#f00;font-size:12px;"><strong>Cuota Mensual</strong></td>';
                html = html + '<td style="width:25%; text-align:right; color:#f00;font-size:12px;"><strong>'+ formato_numero(totalseguro/12,2,'.',',') + '</strong></td>';
                html = html + '</tr>';
                html = html + '</table>';
                html = html + '</div></div>';
                
                valorFianciadoSeguroIndividual[i-1] = totalseguro;
            }
            
            $('#sectionFinanciamiento').html(html); //este html corresponde a los Anios
            
            html = "";
            
            nclientes = parseFloat($("#numClientes").val());
            
            var sumaAnualesTotates = 0;
            var sumaAnualesTotatesAcumulado = 0;
            //alert(nclientes);
            for(i = 1; i <= parseInt($('#anios').val()); i++)
            {
                var totalCuotaSeguro = parseFloat(valorFianciadoSeguroIndividual[i-1]) / 12;
                sumaAnualesTotates += parseFloat(valorFianciadoSeguroIndividual[i-1]);
                sumaAnualesTotatesAcumulado += parseFloat(valorFianciadoSeguroIndividual[i-1]);
                
                
                html = html + '<tr>';
                html = html + '<td>AÑO '+i+'</td>';
                html = html + '<td style="text-align:right;">12</td>';
                html = html + '<td style="text-align:right;">'+formato_numero(totalCuotaSeguro,2,'.',',')+'</td>';
                html = html + '<td style="text-align:right;">'+formato_numero(valorFianciadoSeguroIndividual[i-1],2,'.',',')+'</td>';
                html = html + '<td>&nbsp;</td>';
                html = html + '<td style="text-align:right;">&nbsp;</td>';
                html = html + '<td style="text-align:right;">AÑO '+i+'</td>';
                html = html + '<td style="text-align:right;">'+formato_numero(valorFianciadoSeguroIndividual[i-1],2,'.',',')+'</td>';
                html = html + '<td style="text-align:right;">'+formato_numero(valorFianciadoSeguroIndividual[i-1]*nclientes,2,'.',',')+'</td>';
                html = html + '</tr>';
            }
            
            var constSumaAnualesTotates = sumaAnualesTotates*nclientes;
            
            html = html + '<tr>';
            html = html + '<td>&nbsp;</td>';
            html = html + '<td>&nbsp;</td>';
            html = html + '<td>&nbsp;</td>';
            html = html + '<td style="text-align:right;">'+formato_numero(sumaAnualesTotates,2,'.',',')+'</td>';
            html = html + '<td>&nbsp;</td>';
            html = html + '<td style="text-align:center;">&nbsp;</td>';
            html = html + '<td style="text-align:right;">&nbsp;</td>';
            html = html + '<td style="text-align:right;">'+formato_numero(sumaAnualesTotates,2,'.',',')+'</td>';
            html = html + '<td style="text-align:right;">'+formato_numero(constSumaAnualesTotates,2,'.',',')+'</td>';
            html = html + '</tr>';
            html = html + '<tr>';
            html = html + '<td height="230">&nbsp;</td>';
            html = html + '<td colspan="2" style="text-align:right;">Valor Cuota Promedio</td>';
            html = html + '<td style="text-align:right;color:#00AB4F;font-size:30px;"><strong>'+formato_numero(sumaAnualesTotates/(12*parseInt($('#anios').val())),2,'.',',')+'</strong></td>';
            html = html + '<td>&nbsp;</td>';
            html = html + '<td>&nbsp;</td>';
            html = html + '<td>&nbsp;</td>';
            html = html + '<td>&nbsp;</td>';
            html = html + '<td>&nbsp;</td>';
            html = html + '</tr>';
            
            var trs=$("#tablaFinanciamiento tr").length;
            var tds = 0;
            
            if(trs-1>0)
            {
                tds = trs-1;
            }
            for(var i=0;i<tds;i++){
                // Eliminamos la ultima columna
                $("#tablaFinanciamiento tr:last").remove();
            }
            
            $('#tablaFinanciamiento tr:last').after(html);
            
            //-----------------------------------------------------------------------------------------------------------------------------------------------------
            
            //SEGURO
            //------------------------------------------------------------------------------------------------------------------
            //tabla del seguro individual
            //------------------------------------------------------------------------------------------------------------------

            //tasa_riesgo = parseFloat($('#valorAsegurado').val()) * (parseFloat($('#tasaFinanciado').val())/100);
            //impsuper = parseFloat($('#valorAsegurado').val()) * (parseFloat($('#ed_impsuper').val())/1000);

            vfinanciado = sumaAnualesTotates;
            dividendo = vfinanciado / (parseInt($('#anios').val())*12);
            saldo = sumaAnualesTotates;

            //ed_intseguro

            var intseguros = $('#tasaFinanciamiento').val();

            //intereses = ((sumaseguros) * (parseFloat($('#ed_interes').val())/100));
            intereses = ((sumaAnualesTotates) * (parseFloat(intseguros)/100));
            
            var datostabla = "";
            
            datostabla = datostabla + '<div class="mdl-card mdl-cell mdl-cell--12-col">';
            datostabla = datostabla + '<div class="mdl-card__supporting-text mdl-grid mdl-grid--no-spacing">';
            datostabla = datostabla + '<table width = "100%" border = 0 >';
            datostabla = datostabla + '<tr class="mdl-color--primary-dark colorFuente" style=";text-align:center;"><td width = "10%">No.</td><td width = "15%">VENCIMIENTO</td><td width = "15%">SALDO</td><td width = "15%">INTERES</td><td width = "15%">CAPITAL</td><td width = "15%">DIVIDENDO</td></tr>';

      //alert(anio+"-"+mes+"-"+dia);

            var j = 1;
            var columnaanio = "";
            var suma_interes = 0;
            var suma_cuotas = 0;
            var cuotasSeguro = new Array();
            
            var fondo = ' style="background:#F6F6F6;"';
            var anualInteresesInd = new Array();
            var j = 0;
            anualInteresesInd[j] = 0;
            fecha = constFecha;
            for(i = 0; i < parseInt($('#anios').val())*12; i++)
            {
                /*if(i%12 == 0 && i > 11)
                {
                    j++;
                    columnaanio = '<td rowspan="12" align="center">'+(j)+'</td>';
                }
                else
                {
                    columnaanio = "";
                }*/
                
                if(i%2 == 0)
                {
                    fondo = ' style="background:#F6F6F6;"';
                }
                else
                {
                    fondo = '';
                }
                
                if(i == 0)
                    var columnaanio = '<td rowspan="12" align="center">'+(j)+'</td>';

                fecha=fecha.replace("-", "/").replace("-", "/");
                fecha= new Date(fecha);
                fecha.setDate(fecha.getDate()+sumarDias);

                var anio=fecha.getFullYear();
                var mes= fecha.getMonth()+1;
                var dia= fecha.getDate();

                if(mes.toString().length<2){
                    mes="0".concat(mes);
                }

                if(dia.toString().length<2){
                    dia="0".concat(dia);
                }

                /*saldo = saldo - dividendo;
                numero = 1 + i;

                datostabla = datostabla + '<tr><td>' + numero + '</td><td align="left">' + dia+"/"+mes+"/"+anio + '</td><td align="right">' + (Math.round(saldo*100)/100).toFixed(2) + '</td><td align="right">' + (Math.round((intereses/(parseInt($('#anios').val())*12))*100)/100).toFixed(2)  + '</td><td align="right">' + (Math.round(dividendo*100)/100).toFixed(2)  + '</td><td align="right">' +  (Math.round(((intereses/(parseInt($('#anios').val())*12))+dividendo)*100)/100).toFixed(2)  + '</td>'+columnaanio+'</tr>';
                fecha = anio+"-"+mes+"-"+dia;*/

                intereses = ((vfinanciado-(dividendo*i)) * (parseFloat(intseguros)/100))/12;
                suma_interes = suma_interes + intereses;
                saldo = saldo - dividendo;
                numero = 1 + i;
                
                suma_cuotas = suma_cuotas + (Math.round((intereses+dividendo)*100)/100);

                datostabla = datostabla + '<tr '+fondo+'><td>' + numero + '</td><td align="left">' + dia+"/"+mes+"/"+anio + '</td><td align="right">' + formato_numero(saldo,2,'.',',') + '</td><td align="right">' + formato_numero(intereses,2,'.',',') + '</td><td align="right">' + formato_numero(dividendo,2,'.',',') + '</td><td align="right">' + formato_numero(Math.round((intereses+dividendo)*100)/100,2,'.',',') + '</td>'+  '</tr>';
                cuotasSeguro[i] = Math.round((intereses+dividendo)*100)/100;
                fecha = anio+"-"+mes+"-"+dia;
                
                if(i%12 == 0 && i > 11)
                {
                    j++;
                    anualInteresesInd[j] = 0;
                }
                anualInteresesInd[j] = anualInteresesInd[j] + intereses;
            }
            //suma_interes = Math.round(intereses*100)/100;

            //$('#ed_total').val(((vfinanciado + suma_interes + tasa_riesgo + impsuper)*nclientes).toFixed(2));
            //$('#ed_total').val(((vfinanciado)*nclientes).toFixed(2));



            datostabla = datostabla + '</table>';
            
            datostabla = datostabla + '</div></div>';

            //cuota mensual promedio con intereses
            var cuotapromedioseguro = suma_cuotas/(j*12);
            var interesseguro = suma_interes
            var totalseguro = parseFloat(sumaseguros)+parseFloat(suma_interes);

            $('#sectionAmortIndividual').empty();
            $('#sectionAmortIndividual').html(datostabla);
            
            datostabla = "";
            datostabla = datostabla + '<div class="mdl-card mdl-cell mdl-cell--12-col">';
            datostabla = datostabla + '<div class="mdl-card__supporting-text mdl-grid mdl-grid--no-spacing">';
            datostabla = datostabla + '<table width="100%" border="0"><tr><td>&nbsp;</td><td><div align="right">Total Interés Generado</div></td><td><div align="right">Tasa Beneficio Cliente</div></td><td><div align="right">Utilidad Usuario</div></td></tr>';
            
            var tasaBeneficioClienteIndividual = 0;
            var porcentajeBeneficioCliente = parseFloat($('#tasaBeneficioCliente').val()) / 100;
            var totalInteresIndividual = 0;
            var totalBeneficioIndividual = 0;
            var totalutilidadUsuarioIndividual = 0;
            
            for(i = 0; i < parseInt($('#anios').val()); i++)
            {
                tasaBeneficioClienteIndividual = parseFloat(anualInteresesInd[i]) * porcentajeBeneficioCliente;
                var utilidadUsuarioind = parseFloat(anualInteresesInd[i]) - tasaBeneficioClienteIndividual;
                
                datostabla = datostabla + '<tr><td>AÑO '+(i+1)+'</td><td><div align="right">'+formato_numero(anualInteresesInd[i],2,'.',',')+'</div></td><td><div align="right">'+formato_numero(tasaBeneficioClienteIndividual,2,'.',',')+'</div></td><td><div align="right">'+formato_numero(utilidadUsuarioind,2,'.',',')+'</div></td></tr>';
                
                totalInteresIndividual += anualInteresesInd[i];
                totalBeneficioIndividual += tasaBeneficioClienteIndividual;
                totalutilidadUsuarioIndividual += utilidadUsuarioind;
            }
            datostabla = datostabla + '<tr style="color:#003300; font-size:24px"><td>TOTAL</td><td><div align="right">'+formato_numero(totalInteresIndividual,2,'.',',')+'</div></td><td><div align="right">'+formato_numero(totalBeneficioIndividual,2,'.',',')+'</div></td><td><div align="right">'+formato_numero(totalutilidadUsuarioIndividual,2,'.',',')+'</div></td></tr>';
            datostabla = datostabla + '</table>';
            
            datostabla = datostabla + '</div></div>';
            
            $('#tablaTasaBeneficio').empty();
            $('#tablaTasaBeneficio').html(datostabla);
            //-----------------------------------------------------------------------------------------------------------------


            

            //------------------------------------------------------------------------------------------------------------------------
            //tabla del monto financiado + CUOTA PROMEDIO DEL SEGURO

            //tasa_riesgo = parseFloat($('#valorAsegurado').val()) * (parseFloat($('#tasaFinanciado').val())/100);
            //impsuper = parseFloat($('#valorAsegurado').val()) * (parseFloat($('#ed_impsuper').val())/1000);
            vfinanciado = parseFloat($('#valorAsegurado').val())*nclientes;
            saldo = vfinanciado;
            intereses = ((vfinanciado) * (parseFloat($('#ed_interes').val())/100));
            dividendo = vfinanciado / (parseInt($('#anios').val())*12);

            datostabla = '<table width = "100%" border = 0>';
            datostabla = datostabla + '<th width = "5%" bgcolor="#990000 "><b><font  color="white">No.</font></b></th><th bgcolor="#990000 " width = "15%"><b><font  color="white">VENCIMIENTO</font></b></th><th bgcolor="#990000 " width = "15%"><b><font  color="white">SALDO</font></b></th><th bgcolor="#990000 " width = "15%"><b><font  color="white">INTERES</font></b></th><th bgcolor="#990000 " width = "15%"><b><font  color="white">CAPITAL</font></b></th><th bgcolor="#990000 " width = "12%"><b><font color="white">SEGURO</font></b></th><th bgcolor="#990000 " width = "13%"><b><font color="white">DIVIDENDO</font></b></th><th bgcolor="#990000 " width = "5%"><b><font color="white">A&Ntilde;O</font></b></th></tr>';

      //alert(anio+"-"+mes+"-"+dia);

            var j = 1;
            var columnaanio = "";
            var suma_interes = 0;
            var suma_cuotas = 0;
            fecha = constFecha;
            for(i = 0; i < parseInt($('#anios').val())*12; i++)
            {
                if(i%12 == 0 && i > 11)
                {
                    j++;
                    columnaanio = '<td rowspan="12" align="center">'+(j)+'</td>';
                }
                else
                {
                    columnaanio = "";
                }

                if(i == 0)
                    var columnaanio = '<td rowspan="12" align="center">'+(j)+'</td>';

                fecha=fecha.replace("-", "/").replace("-", "/");
                fecha= new Date(fecha);
                fecha.setDate(fecha.getDate()+sumarDias);

                var anio=fecha.getFullYear();
                var mes= fecha.getMonth()+1;
                var dia= fecha.getDate();

                if(mes.toString().length<2){
                    mes="0".concat(mes);
                }

                if(dia.toString().length<2){
                    dia="0".concat(dia);
                }

                /*saldo = saldo - dividendo;
                numero = 1 + i;

                datostabla = datostabla + '<tr><td>' + numero + '</td><td align="left">' + dia+"/"+mes+"/"+anio + '</td><td align="right">' + (Math.round(saldo*100)/100).toFixed(2) + '</td><td align="right">' + (Math.round((intereses/(parseInt($('#anios').val())*12))*100)/100).toFixed(2)  + '</td><td align="right">' + (Math.round(dividendo*100)/100).toFixed(2)  + '</td><td align="right">' +  (Math.round(((intereses/(parseInt($('#anios').val())*12))+dividendo)*100)/100).toFixed(2)  + '</td>'+columnaanio+'</tr>';
                fecha = anio+"-"+mes+"-"+dia;*/

                intereses = ((vfinanciado-(dividendo*i)) * (parseFloat($('#ed_interes').val())/100))/12;
                suma_interes = suma_interes + intereses;
                saldo = saldo - dividendo;
                numero = 1 + i;

                suma_cuotas = suma_cuotas + (Math.round((intereses+dividendo)*100)/100);

                datostabla = datostabla + '<tr><td>' + numero + '</td><td align="left">' + dia+"/"+mes+"/"+anio + '</td><td align="right">' + formato_numero(Math.round(saldo*100)/100,2,'.',',') + '</td><td align="right">' + formato_numero(Math.round(intereses*100)/100,2,'.',',')  + '</td><td align="right">' + formato_numero(Math.round(dividendo*100)/100,2,'.',',') + '</td><td align="right">' + formato_numero(cuotasSeguro[i],2,'.',',') + '</td><td align="right">' + formato_numero(parseFloat(cuotasSeguro[i]) + (Math.round((intereses+dividendo)*100)/100),2,'.',',') + '</td>' + columnaanio + '</tr>';
                fecha = anio+"-"+mes+"-"+dia;
            }
            //suma_interes = Math.round(intereses*100)/100;



            //$('#ed_total').val(((vfinanciado + suma_interes + tasa_riesgo + impsuper)*nclientes).toFixed(2));
            //$('#ed_total').val(((vfinanciado)*nclientes).toFixed(2));



            datostabla = datostabla + '</table>';

            //resumen cabecera
            datostabla1 = '<table width="100%" border="0">';
            datostabla1 = datostabla1 + '<tr>';
            datostabla1 = datostabla1 + '<td style="width:30%; background-color:#990000; color:#fff;">RESULTADOS</td>';
            datostabla1 = datostabla1 + '<td>&nbsp;</td>';
            datostabla1 = datostabla1 + '</tr>';
            datostabla1 = datostabla1 + '</table>';
            datostabla1 = datostabla1 + '<table width="100%" border="1">';
            datostabla1 = datostabla1 + '<tr>';
            datostabla1 = datostabla1 + '<td style="width:75%">TOTAL INTERESES GENERADOS POR FINANCIAMIENTO DEL CREDITO Y SEGURO</td>';
            datostabla1 = datostabla1 + '<td style="width:25%"><div align="right">'+ formato_numero(parseFloat(suma_interes)+parseFloat(interesseguro),2,'.',',') +'</div></td>';
            datostabla1 = datostabla1 + '</tr>';
            /*datostabla1 = datostabla1 + '<tr>';
            datostabla1 = datostabla1 + '<td style="width:75%">VALOR CUOTA MENSUAL PROMEDIO (CON INTERESES SIN SEGURO)</td>';
            datostabla1 = datostabla1 + '<td style="width:25%"><div align="right">'+ parseFloat(suma_cuotas/(j*12)).toFixed(2) +'</div></td>';
            datostabla1 = datostabla1 + '</tr>';*/
            datostabla1 = datostabla1 + '<tr>';
            datostabla1 = datostabla1 + '<td style="width:75%">VALOR CUOTA MENSUAL PROMEDIO (CON INTERESES + CUOTA MENSUAL PROMEDIO SEGURO)</td>';
            datostabla1 = datostabla1 + '<td style="width:25%"><div align="right">'+ formato_numero(parseFloat(suma_cuotas)/(j*12)+parseFloat(cuotapromedioseguro),2,'.',',') +'</div></td>';
            datostabla1 = datostabla1 + '</tr>';
            datostabla1 = datostabla1 + '<tr>';
            datostabla1 = datostabla1 + '<td style="width:75%">COSTO TOTAL DE CREDITO (INCLUIDO INTERESES + SEGURO)</td>';
            datostabla1 = datostabla1 + '<td style="width:25%"><div align="right">'+ formato_numero(parseFloat($('#valorAsegurado').val())+parseFloat(suma_interes)+parseFloat(totalseguro),2,'.',',') +'</div></td>';
            datostabla1 = datostabla1 + '</tr>';
            datostabla1 = datostabla1 + '</table>';
            datostabla1 = datostabla1 + '<br><br>';

            datostabla = datostabla1 + datostabla;

            $('#JTPanel5').html(datostabla);
            //-----------------------------------------------------------------------------------------------------------------

            //RESUMEN ---------------------------------------------------------------------------------------------------------
            var diferente = parseFloat(tasaExterna_riesgo)-parseFloat(tasaInterna_riesgo);
            datostabla = '<table width = "100%" border = 0>';
            datostabla = datostabla + '<tr>';
            datostabla = datostabla + '<td colspan="2" style="background-color:#990000; color:#fff;"><strong>DIFERENCIAL</strong></td>';
            datostabla = datostabla + '</tr>';
            datostabla = datostabla + '<tr>';
            datostabla = datostabla + '<td width="75%">Rendimiento por concepto de Diferencial</td>';
            datostabla = datostabla + '<td width="25%"><div align="right">'+formato_numero(diferente,2,'.',',')+'</div></td>';
            datostabla = datostabla + '</tr>';
            datostabla = datostabla + '<tr>';
            datostabla = datostabla + '<td style="background-color:#990000; color:#fff;"><div align="right"><strong>TOTAL :</strong></div></td>';
            datostabla = datostabla + '<td><div align="right">'+formato_numero(diferente,2,'.',',') +'</div></td>';
            datostabla = datostabla + '</tr>';
            datostabla = datostabla + '</table>';
            datostabla = datostabla + '<br>';
            datostabla = datostabla + '<table width = "100%" border = 1>';
            datostabla = datostabla + '<tr>';
            datostabla = datostabla + '<td colspan="2" style="background-color:#990000; color:#fff;"><strong>FINANCIAMIENTO</strong></td>';
            datostabla = datostabla + '</tr>';
            datostabla = datostabla + '<tr>';
            datostabla = datostabla + '<td width="75%">Tasa de inter&eacute;s aplicada</td>';
            datostabla = datostabla + '<td width="25%"><div align="right">'+formato_numero($('#ed_intseguro').val(),2,'.',',')+'%</div></td>';
            datostabla = datostabla + '</tr>';
            datostabla = datostabla + '<tr>';
            datostabla = datostabla + '<td width="75%">Ingresos por inter&eacute;s cobrado</td>';
            datostabla = datostabla + '<td width="25%"><div align="right">'+formato_numero(interesseguro,2,'.',',')+'</div></td>';
            datostabla = datostabla + '</tr>';
            datostabla = datostabla + '<tr>';
            datostabla = datostabla + '<td style="background-color:#990000; color:#fff;"><div align="right"><strong>TOTAL :</strong></div></td>';
            datostabla = datostabla + '<td><div align="right">'+formato_numero(interesseguro,2,'.',',')+'</div></td>';
            datostabla = datostabla + '</tr>';
            datostabla = datostabla + '</table>';
            datostabla = datostabla + '<br>';
            datostabla = datostabla + '<table width = "100%" border = 1>';
            datostabla = datostabla + '<tr>';
            datostabla = datostabla + '<td width="75%" style="background-color:#990000; color:#fff;"><div align="right"><strong>TOTAL RENDIMIENTO</strong> :</div></td>';
            datostabla = datostabla + '<td width="25%"><div align="right">'+formato_numero(parseFloat(diferente)+parseFloat(interesseguro),2,'.',',')+'</div></td>';
            datostabla = datostabla + '</tr>';
            datostabla = datostabla + '</table>';

            $('#pn_resumen').html(datostabla);
            //alert(datostabla);
            //FIN RESUMEN -----------------------------------------------------------------------------------------------------

            //para dibujar el chart-------------------------------------------------------------------------
            //DIFERENCIAL-----------------------
            
            
            
            html = '';
                
            var tasaFinanciamiento = parseFloat($('#tasaFinanciamiento').val())/100;
            var tasaInicial = parseFloat($('#tasaSeguro').val())/100;
            var tasaFinal = parseFloat($('#tasaFinanciado').val())/100;
            var sumaDiferencialFavor = 0;
            var diferencialfavor = new Array();
            
            for(i = 1; i <= parseInt($('#anios').val()); i++)
            {
                if(i==1)
                {
                    //aqui si no se desea la multiplicacion del monto por numero de usuarios
                    var financia = parseFloat(parseFloat($('#valorAsegurado').val()).toFixed(2))*nclientes;
                }
                else if(i==2)
                {
                    financia = parseFloat(parseFloat(financia*(1-(parseFloat($('#porcDepreciacion1').val())/100))).toFixed(2));
                }
                else
                {
                    financia = parseFloat(parseFloat(financia*(1-(parseFloat($('#porcDepreciacion2').val())/100))).toFixed(2));
                }
                
                valorAnualSeguro[i-1] = valorAnualSeguro[i-1].replace(",","");
                var valortasaFinanciamiento = parseFloat(valorAnualSeguro[i-1]) * parseFloat(tasaFinanciamiento);
                
                var valorTasaInicial = parseFloat(financia) * parseFloat(tasaInicial);
                var valorTasaFinal = parseFloat(financia) * parseFloat(tasaFinal);
                
                diferencialfavor[i-1] = parseFloat(valorTasaFinal) - parseFloat(valorTasaInicial);
                
                
                sumaDiferencialFavor = sumaDiferencialFavor + diferencialfavor[i-1];
                
                html = html + '<div class="mdl-card mdl-cell mdl-cell--6-col">';
                html = html + '<div class="mdl-card__supporting-text mdl-grid mdl-grid--no-spacing">';
                html = html + '<table width="100%">';
                html = html + '<tr class="mdl-color--primary-dark colorFuente">';
                html = html + '<td style="text-align:center;" colspan="2"><b>AÑO '+i+'</b></td>';
                html = html + '</tr>';
                html = html + '<tr>';
                html = html + '<td width="55%">&nbsp;</td>';
                html = html + '<td width="45%">&nbsp;</td>';
                html = html + '</tr>';
                html = html + '<tr style="background:#F6F6F6;">';
                html = html + '<td><span style="float:right;">Valor asegurable</span></td>';
                html = html + '<td><label style="float:right;" id="lblValorAsegurado">'+formato_numero(financia,2,'.',',') +'</label></td>';
                html = html + '</tr>';
                html = html + '<tr>';
                html = html + '<td><span style="float:right;">Valor tasa inicial</span></td>';
                html = html + '<td><label style="float:right;" id="lblValorTasa">'+formato_numero(valorTasaInicial,2,'.',',')+'</label></td>';
                html = html + '</tr>';
                html = html + '<tr style="background:#F6F6F6;">';
                html = html + '<td><span style="float:right;">Valor tasa final</span></td>';
                html = html + '<td><label style="float:right;" id="lblValorSB">'+formato_numero(valorTasaFinal,2,'.',',')+'</label></td>';
                html = html + '</tr>';
                html = html + '<tr>';
                html = html + '<td>&nbsp;</td>';
                html = html + '<td><hr></td>';
                html = html + '</tr>';
                html = html + '<tr style="background:#F6F6F6;">';
                html = html + '<td><span style="float:right;">Diferencial a favor de financiera</span></td>';
                html = html + '<td><label style="float:right;" id="lblValorSubtotal">'+formato_numero(diferencialfavor[i-1],2,'.',',')+'</label></td>';
                html = html + '</tr>';
                html = html + '<tr>';
                html = html + '<td><span style="float:right;"><strong>TOTAL INGRESO AÑO</strong></span></td>';
                html = html + '<td><label style="float:right;" id="lblValorTotal"><strong>'+formato_numero(diferencialfavor[i-1],2,'.',',')+'</strong></label></td>';
                //html = html + '<td><label style="float:right;" id="lblValorTotal">'+formato_numero(sumaDiferencialFavor,2,'.',',')+'</label></td>';
                html = html + '</tr>';
                html = html + '</table>';
                html = html + '</div>';
                html = html + '</div>';
                
            }
            html = html + '<h5 style="text-align:center;" class="mdl-cell mdl-cell--12-col">TOTAL DE INGRESOS EN '+$('#anios').val()+' AÑOS: '+formato_numero(sumaDiferencialFavor,2,'.',',');
            //alert(sumaDiferencialFavor);
            
            $('#diferencialesValor').empty();
            $('#diferencialesValor').html(html);
            
            
            html = "";
            
            var tasamercadoValores = parseFloat($("#tasamercadoValores").val())/100;
            var sumaPorcentajeDiferenciales = 0;
            
            html = html + '<table width="100%" border="0">';
            
            for(i = 1; i <= parseInt($('#anios').val()); i++)
            {
                html = html + '<tr>';
                html = html + '<td style="text-align:right; width:33%;">AÑO '+i+'</td>';
                html = html + '<td style="text-align:right; width:34%;">'+formato_numero(diferencialfavor[i-1],2,'.',',')+'</td>';
                html = html + '<td style="text-align:right; width:33%;">'+formato_numero(parseFloat(parseFloat(diferencialfavor[i-1])*tasamercadoValores),2,'.',',')+'</td>';
                html = html + '</tr>';
                
                sumaPorcentajeDiferenciales += parseFloat(parseFloat(diferencialfavor[i-1])*tasamercadoValores)
            }
            
            html = html + '<tr>';
            html = html + '<td colspan="3" style="text-align:center;color:#003300;font-size:20px;"><strong>TOTAL RENDIMIENTO '+formato_numero(sumaPorcentajeDiferenciales,2,'.',',')+'</strong></td>';
            html = html + '</tr>';
            html = html + '</table>';
            
            //alert(html);
            $('#totalRendimiento').empty();
            $('#totalRendimiento').append(html); //este html corresponde al % de la tasa del mercado de valores en DIFERENCIAL
            
            /*$('#lbl_seguro').empty();
            $('#lbl_seguro').append('<center><label><b>USD '+formato_numero(tasaExterna_riesgo,2,'.',',')+'</b><br><b>TOTAL DEL SEGURO<br>(SIN IMPUESTOS)</b></label></center>');
            dibujar('Costo',parseFloat(tasaInterna_riesgo),'Diferencial',parseFloat(tasaExterna_riesgo-tasaInterna_riesgo),'diferencial','pn_chart');
            */
            
            //RENDIMIENTO------------------------------------------
            /*$('#lbl_seguro2').empty();
            $('#lbl_seguro2').append('<center><label><b>USD '+formato_numero(totalseguro,2,'.',',')+'</b><br><b>TOTAL DEL SEGURO<br>(CON IMPUESTOS E INTERESES)</b></label></center>');
            dibujar('Costo',parseFloat(totalseguro-interesseguro),'Interes',parseFloat(interesseguro),'Rendimiento','pn_chart2');*/
            //fin para dibujar el chart---------------------------------------------------------------------
            
            
            
            
            
            //SEGURO 2
            //------------------------------------------------------------------------------------------------------------------
            //tabla del seguro COLECTIVO
            //------------------------------------------------------------------------------------------------------------------

            //tasa_riesgo = parseFloat($('#valorAsegurado').val()) * (parseFloat($('#tasaFinanciado').val())/100);
            //impsuper = parseFloat($('#valorAsegurado').val()) * (parseFloat($('#ed_impsuper').val())/1000);
            var sumaAnualesTotatesCol = constSumaAnualesTotates;
            vfinanciadoCol = sumaAnualesTotatesCol;
            dividendoCol = vfinanciadoCol / (parseInt($('#anios').val())*12);
            saldoCol = sumaAnualesTotatesCol;
            
            //ed_intseguro

            var intsegurosCol = $('#tasaFinanciamiento').val();

            //interesesCol = ((sumaseguros) * (parseFloat($('#ed_interes').val())/100));
            interesesCol = ((sumaAnualesTotatesCol) * (parseFloat(intsegurosCol)/100));
            
            var datostabla = "";
            
            datostabla = datostabla + '<div class="mdl-card mdl-cell mdl-cell--12-col">';
            datostabla = datostabla + '<div class="mdl-card__supporting-text mdl-grid mdl-grid--no-spacing">';
            datostabla = datostabla + '<table width = "100%" border = 0 >';
            datostabla = datostabla + '<tr class="mdl-color--primary-dark colorFuente" style="text-align:center;"><td width = "10%">No.</td><td width = "15%">VENCIMIENTO</td><td width = "15%">SALDO</td><td width = "15%">INTERES</td><td width = "15%">CAPITAL</td><td width = "15%">DIVIDENDO</td></tr>';

      //alert(anio+"-"+mes+"-"+dia);

            var j = 1;
            var suma_interesCol = 0;
            var suma_cuotasCol = 0;
            var cuotasSeguroCol = new Array();
            
            var fondo = ' style="background:#F6F6F6;"';
            var anualinteresesCol = new Array();
            var j = 0;
            anualinteresesCol[j] = 0;
            fecha = constFecha;
            for(i = 0; i < parseInt($('#anios').val())*12; i++)
            {
                
                if(i%2 == 0)
                {
                    fondo = ' style="background:#F6F6F6;"';
                }
                else
                {
                    fondo = '';
                }
                
                if(i == 0)
                    var columnaanio = '<td rowspan="12" align="center">'+(j)+'</td>';

                fecha=fecha.replace("-", "/").replace("-", "/");
                fecha= new Date(fecha);
                fecha.setDate(fecha.getDate()+sumarDias);

                var anio=fecha.getFullYear();
                var mes= fecha.getMonth()+1;
                var dia= fecha.getDate();

                if(mes.toString().length<2){
                    mes="0".concat(mes);
                }

                if(dia.toString().length<2){
                    dia="0".concat(dia);
                }

                /*saldoCol = saldoCol - dividendoCol;
                numero = 1 + i;

                datostabla = datostabla + '<tr><td>' + numero + '</td><td align="left">' + dia+"/"+mes+"/"+anio + '</td><td align="right">' + (Math.round(saldoCol*100)/100).toFixed(2) + '</td><td align="right">' + (Math.round((interesesCol/(parseInt($('#anios').val())*12))*100)/100).toFixed(2)  + '</td><td align="right">' + (Math.round(dividendoCol*100)/100).toFixed(2)  + '</td><td align="right">' +  (Math.round(((interesesCol/(parseInt($('#anios').val())*12))+dividendoCol)*100)/100).toFixed(2)  + '</td>'+columnaanio+'</tr>';
                fecha = anio+"-"+mes+"-"+dia;*/

                interesesCol = ((vfinanciadoCol-(dividendoCol*i)) * (parseFloat(intsegurosCol)/100))/12;
                suma_interesCol = suma_interesCol + interesesCol;
                saldoCol = saldoCol - dividendoCol;
                numero = 1 + i;
                
                suma_cuotasCol = suma_cuotasCol + (Math.round((interesesCol+dividendoCol)*100)/100);

                datostabla = datostabla + '<tr '+fondo+'><td>' + numero + '</td><td align="left">' + dia+"/"+mes+"/"+anio + '</td><td align="right">' + formato_numero(saldoCol,2,'.',',') + '</td><td align="right">' + formato_numero(interesesCol,2,'.',',') + '</td><td align="right">' + formato_numero(dividendoCol,2,'.',',') + '</td><td align="right">' + formato_numero(Math.round((interesesCol+dividendoCol)*100)/100,2,'.',',') + '</td>'+  '</tr>';
                cuotasSeguroCol[i] = Math.round((interesesCol+dividendoCol)*100)/100;
                fecha = anio+"-"+mes+"-"+dia;
                
                if(i%12 == 0 && i > 11)
                {
                    j++;
                    anualinteresesCol[j] = 0;
                }
                anualinteresesCol[j] = anualinteresesCol[j] + interesesCol;
            }
            //suma_interesCol = Math.round(interesesCol*100)/100;

            //$('#ed_total').val(((vfinanciadoCol + suma_interesCol + tasa_riesgo + impsuper)*nclientes).toFixed(2));
            //$('#ed_total').val(((vfinanciadoCol)*nclientes).toFixed(2));



            datostabla = datostabla + '</table>';
            
            datostabla = datostabla + '</div></div>';

            //cuota mensual promedio con interesesCol
            var cuotapromedioseguro = suma_cuotasCol/(j*12);
            var interesseguro = suma_interesCol
            var totalseguro = parseFloat(sumaseguros)+parseFloat(suma_interesCol);

            $('#sectionAmortColectivo').empty();
            $('#sectionAmortColectivo').html(datostabla);
            
            datostabla = "";
            datostabla = datostabla + '<div class="mdl-card mdl-cell mdl-cell--12-col">';
            datostabla = datostabla + '<div class="mdl-card__supporting-text mdl-grid mdl-grid--no-spacing">';
            datostabla = datostabla + '<table width="100%" border="0"><tr><td>&nbsp;</td><td><div align="right">Total Interés Generado</div></td><td><div align="right">Tasa Beneficio Cliente</div></td><td><div align="right">Utilidad Usuario</div></td></tr>';
            
            var tasaBeneficioClienteIndividual = 0;
            var porcentajeBeneficioCliente = parseFloat($('#tasaBeneficioClienteInd').val()) / 100;
            var totalInteresIndividual = 0;
            var totalBeneficioIndividual = 0;
            var totalutilidadUsuarioIndividual = 0;
            
            for(i = 0; i < parseInt($('#anios').val()); i++)
            {
                tasaBeneficioClienteIndividual = parseFloat(anualinteresesCol[i]) * porcentajeBeneficioCliente;
                var utilidadUsuarioind = parseFloat(anualinteresesCol[i]) - tasaBeneficioClienteIndividual;
                
                datostabla = datostabla + '<tr><td>AÑO '+(i+1)+'</td><td><div align="right">'+formato_numero(anualinteresesCol[i],2,'.',',')+'</div></td><td><div align="right">'+formato_numero(tasaBeneficioClienteIndividual,2,'.',',')+'</div></td><td><div align="right">'+formato_numero(utilidadUsuarioind,2,'.',',')+'</div></td></tr>';
                
                totalInteresIndividual += anualinteresesCol[i];
                totalBeneficioIndividual += tasaBeneficioClienteIndividual;
                totalutilidadUsuarioIndividual += utilidadUsuarioind;
                
                //alert(tasaBeneficioClienteIndividual/nclientes);
            }
            datostabla = datostabla + '<tr style="color:#003300; font-size:24px"><td>TOTAL</td><td><div align="right">'+formato_numero(totalInteresIndividual,2,'.',',')+'</div></td><td><div align="right">'+formato_numero(totalBeneficioIndividual,2,'.',',')+'</div></td><td><div align="right">'+formato_numero(totalutilidadUsuarioIndividual,2,'.',',')+'</div></td></tr>';
            datostabla = datostabla + '</table>';
            
            datostabla = datostabla + '</div></div>';
            
            $('#tablaTasaBeneficioCol').empty();
            $('#tablaTasaBeneficioCol').html(datostabla);
            //-----------------------------------------------------------------------------------------------------------------
            
            
            //resumen---------------------------------------------------------------------------------------------------------------
            
            var resumen = '';
            
            resumen = '<div class="mdl-card mdl-cell mdl-cell--12-col"> <div class="mdl-card__supporting-text mdl-grid mdl-grid--no-spacing"> <table width="100%" border="0"> <tr> <td><strong>CONCEPTO: <span style="color:#F00;">DIFERENCIAL</span></strong></td><td>&nbsp;</td></tr><tr> <td>&nbsp;</td><td>&nbsp;</td></tr><tr style="background:#F6F6F6;"> <td>Rendimiento por concepto de Diferencial</td><td><div align="right">'+formato_numero(sumaDiferencialFavor,2,'.',',')+'</div></td></tr><tr> <td>Rendimiento Financiero (Mercado de Valores)</td><td><div align="right">'+formato_numero(sumaPorcentajeDiferenciales,2,'.',',')+'</div></td></tr><tr style="background:#F6F6F6;"> <td><span style="color:#F00;">TOTAL RENDIMIENTO POR DIFERENCIAL</span></td><td><div align="right">'+formato_numero(sumaDiferencialFavor+sumaPorcentajeDiferenciales,2,'.',',')+'</div></td></tr><tr> <td>&nbsp;</td><td>&nbsp;</td></tr><tr> <td><strong>CONCEPTO: <span style="color:#F00;">FINANCIAMIENTO</span></strong></td><td>&nbsp;</td></tr><tr> <td>&nbsp;</td><td>&nbsp;</td></tr><tr style="background:#F6F6F6;"> <td>Tasa de interés aplicada</td><td><div align="right">'+$('#tasaFinanciamiento').val()+'%</div></td></tr><tr> <td>Ingresos por interés cobrado</td><td><div align="right">'+formato_numero(totalutilidadUsuarioIndividual,2,'.',',')+'</div></td></tr><tr style="background:#F6F6F6;"> <td style="color:#F00;">TOTAL RENDIMIENTO POR FINANCIAMIENTO</td><td><div align="right">'+formato_numero(totalutilidadUsuarioIndividual,2,'.',',')+'</div></td></tr><tr> <td>&nbsp;</td><td>&nbsp;</td></tr><tr> <td><strong>TOTAL RENDIMIENTO OBTENIDO</strong></td><td><div align="right">'+formato_numero(sumaDiferencialFavor+sumaPorcentajeDiferenciales+totalutilidadUsuarioIndividual,2,'.',',')+'</div></td></tr><tr> <td>&nbsp;</td><td>&nbsp;</td></tr><tr> <td colspan="2" style="text-align:center"><strong>BENEFICIO PARA EL CLIENTE (USD)</strong></td></tr><tr> <td>&nbsp;</td><td>&nbsp;</td></tr><tr> <td>Tasa Beneficio Cliente</td><td><div align="right">'+$('#tasaBeneficioCliente').val()+'%</div></td></tr><tr> <td>&nbsp;</td><td>&nbsp;</td></tr><tr style="background:#F6F6F6;"> <td>COLECTIVO</td><td><div align="right">'+formato_numero(totalBeneficioIndividual,2,'.',',')+'</div></td></tr><tr> <td>INDIVIDUAL</td><td><div align="right">'+formato_numero(totalBeneficioIndividual/nclientes,2,'.',',')+'</div></td></tr></table></div></div>';
            
            $('#sectionResumen').empty();
            $('#sectionResumen').html(resumen);
            //--------------------------------------------------------------------------------------------------------------------
            
            
            //DEPRECIACION MENSUAL------------------------------------------------------------------------------------------------
            
            fecha = constFecha;
            
            var html = '';
            
            for(i = 0; i < parseInt($('#anios').val()); i++)
            {
                if(i==0)
                {
                    var financiaDepre = parseFloat(parseFloat($('#valorAsegurado').val()).toFixed(2));
                    depreciado = parseFloat(financiaDepre*(parseFloat($('#porcDepreciacion1').val()))/100)/12;
                }
                else if(i==1)
                {
                    financiaDepre = parseFloat(financiaDepre*(1-(parseFloat($('#porcDepreciacion1').val()))/100));
                    depreciado = parseFloat(financiaDepre*(parseFloat($('#porcDepreciacion2').val())/100))/12;
                }
                else
                {
                    financiaDepre = parseFloat(financiaDepre*(1-(parseFloat($('#porcDepreciacion2').val())/100)));
                    depreciado = parseFloat(financiaDepre*(parseFloat($('#porcDepreciacion2').val())/100))/12;
                }
                
                //var depreciado = (parseFloat(financia) * parseFloat($('#porcDepreciacion1').val())/100)/12;
                    
                html += '<div class="mdl-card mdl-cell mdl-cell--6-col">';
                html += '<div class="mdl-card__supporting-text mdl-grid mdl-grid--no-spacing">';
                //html += '<h5 style="text-align:center;" class="mdl-cell mdl-cell--12-col">DEPRECIACION MENSUAL</h5>';
                html += '<table cellspacing="0" style="width:100%">';
                html += '<tr class="mdl-color--primary-dark colorFuente">';
                html += '<td colspan="3" style="width:25%; text-align:center;" width="68">A&Ntilde;O '+(i+1)+'</td>';
                html += '</tr>';
                
                for(h = 0; h < 12; h++)
                {
                    fecha=fecha.replace("-", "/").replace("-", "/");
                    fecha= new Date(fecha);
                    if(h == 0 && i == 0)
                        fecha.setDate(fecha.getDate());
                    else
                        fecha.setDate(fecha.getDate()+sumarDias);

                    var anio=fecha.getFullYear();
                    var mes= fecha.getMonth()+1;
                    var dia= fecha.getDate();
                    
                    mesDeprecia = mes-1;
                    
                    if(mes.toString().length<2){
                        mes="0".concat(mes);
                    }

                    if(dia.toString().length<2){
                        dia="0".concat(dia);
                    }
                    
                    var mesNombre = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
                    
                    if(h%2 == 0)
                         var fondo = 'style="background:#F6F6F6;"';
                    else
                         var fondo = "";
                    
                    html += '<tr '+fondo+'>';
                    html += '<td style="width:25%; text-align:center;" width="68">'+(h+1)+'</td>';
                    html += '<td style="width:35%;">'+mesNombre[mesDeprecia]+'</td>';
                    html += '<td style="width:40%; text-align:right;" width="171">'+formato_numero((parseFloat(financiaDepre)-(parseFloat(depreciado)*h)),2,'.',',')+'</td>';
                    html += '</tr>';
                    //alert(parseFloat(financiaInicial)-(parseFloat(depreciado)*h));
                    fecha = anio+"-"+mes+"-"+dia;
                    //alert(fecha);
                }
                
                
                html += '</table>';
                html += '</div>';
                html += '</div>';
            }
                
            
            //alert(html);
            $('#sectionDepreMensual').empty();
            $('#sectionDepreMensual').html(html);
            
            
            //--------------------------------------------------------------------------------------------------------------------
            
            
            //quita estilo para visualizar los menus ocultos--------------------------------------
            $('#mnuEscenarios').removeAttr("style");
            $('#mnuDiferenciales').removeAttr("style");
            $('#mnuFinanciamiento').removeAttr("style");
            $('#mnuDepreciacionMensual').removeAttr("style");
            $('#mnuindividual').removeAttr("style");
            $('#mnuColectivo').removeAttr("style");
            $('#mnuResumen').removeAttr("style");
            
            
         }else{
            $('#ed_total').val("0.00");
         }
    });
    
    //clic en boton Recalcular en DIFERENCIAL
    $("#btn_recalculaInteresMercadoValores").click( function() {
        var valor = $("#tasamercadoValores").val();
        
        //$("#tasaFinanciamiento").val(valor);
        
        //eventFire(document.getElementById('btn_calcular'), 'click');
        $("#btn_calcular").click();
    });
    
    $("#btn_recalcularAmortizacion").click( function() {
        
        $("#tasaBeneficioCliente").val($("#tasaBeneficioClienteInd").val());
        $("#tasaBeneficioClienteCol").val($("#tasaBeneficioClienteInd").val());
        $("#btn_calcular").click();
    });
    
    $("#btn_recalcularAmortizacionCol").click( function() {
        
        $("#tasaBeneficioCliente").val($("#tasaBeneficioClienteCol").val());
        $("#tasaBeneficioClienteInd").val($("#tasaBeneficioClienteCol").val());
        $("#btn_calcular").click();
    });
 });

function formato_numero(numero, decimales, separador_decimal, separador_miles){ // v2007-08-06
    numero=parseFloat(numero);

    //alert(numero);

    if(isNaN(numero)){
        return "";
    }

    if(decimales!==undefined){
        // Redondeamos
        numero=numero.toFixed(decimales);
    }

    // Convertimos el punto en separador_decimal
    numero=numero.toString().replace(".", separador_decimal!==undefined ? separador_decimal : ",");

    if(separador_miles){
        // Añadimos los separadores de miles
        var miles=new RegExp("(-?[0-9]+)([0-9]{3})");
        while(miles.test(numero)) {
            numero=numero.replace(miles, "$1" + separador_miles + "$2");
        }
    }

    return numero;
}

function eventFire(el, etype){
    
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}