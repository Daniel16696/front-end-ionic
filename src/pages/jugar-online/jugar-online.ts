import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { RondasPage } from '../rondas/rondas';


@IonicPage()
@Component({
  selector: 'page-jugar-online',
  templateUrl: 'jugar-online.html',
})
export class JugarOnlinePage {
  //Variables de la barra de progreso del tiempo 
  public loadProgressTime: number = 60;
  public loadProgress: number = 100;
  @Input('progress') progress;
  public intervalo2;

  // Variables del juego
  formularioEnviarRespuestas: FormGroup;
  Idpregunta: any;

  static instancia: any;
  static intervaloTiempo: any;
  public pregunta: any;
  public IDMostrarLaPregunta: any;
  public MostrarLaPregunta: any;
  public MostrarLaRespuesta: any;

  public respuesta1: any;
  public arrayRespuestasUsuario = [];
  public arrayRespuestasCortadas = [];
  // public palabraSinTilde: any;
  public palabraDEFINITIVASinTilde: any;
  public palabraDeUsuarioSinTilde: any;
  public contadorPalabrasAcertadas: any;
  public RespuestasConvertidasEnString: any = '';
  public IconosConvertidasEnString: any = '';

  controladorDeRepeticion: any = 0;

  usuarioEnConcretoDeLaAplicacion: any;
  usuarioEnConcretoDeLaAplicacion2: any;
  usuarioOponente: any;
  // public IDusuarioEnConcretoDeLaAplicacion: any;
  // public IDUsuarioContrincante: any;7

  comprobacionDePalabra: any;

  IDusuarioEnConcretoDeLaAplicacion: any;
  IDUsuarioContrincante: any;
  IdSalaAsignadaEnConjunto: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public userService: UserServiceProvider) {
    this.IDusuarioEnConcretoDeLaAplicacion = navParams.get('IDusuarioEnConcretoDeLaAplicacion');
    this.IDUsuarioContrincante = navParams.get('IDUsuarioContrincante');
    this.IdSalaAsignadaEnConjunto = navParams.get('IdSalaAsignadaEnConjunto');
    JugarOnlinePage.instancia = this;

    console.log(this.IDusuarioEnConcretoDeLaAplicacion);
    console.log(this.IDUsuarioContrincante);
    console.log("Sala asignada en conjunto: " + this.IdSalaAsignadaEnConjunto);


    JugarOnlinePage.intervaloTiempo = setTimeout(function () { JugarOnlinePage.instancia.ejecutarCodigoDePregunta(); }, 1000);

    JugarOnlinePage.intervaloTiempo = setTimeout(function () { JugarOnlinePage.instancia.ejecutarCodigoDePregunta2(); }, 2000);


    this.formularioEnviarRespuestas = this.crearFormularioEnviarRespuesta();
    this.contadorPalabrasAcertadas = 0;


  }

  ejecutarCodigoDePregunta() {
    this.userService.getPreguntaAsignada(this.IdSalaAsignadaEnConjunto)
      .subscribe(
        (data) => { // Success
          // this.pregunta = data2;
          // console.log(this.pregunta);
          // this.pregunta1 = this.preguntas[0].pregunta;
          // this.respuesta1 = this.preguntas[0].respuesta;
          // console.log(this.pregunta1);
          // console.log(this.respuesta1);



        },
        (error) => {
          console.error(error);
        }
      )


  }
  ejecutarCodigoDePregunta2() {
    this.userService.getUsuarioDelMovilUsandoPorId(this.IDusuarioEnConcretoDeLaAplicacion)
      .subscribe(
        (data2) => { // Success
          this.usuarioEnConcretoDeLaAplicacion = data2;
          console.log("ESTE ES EL USUARIO DE LA APLICACION " + this.usuarioEnConcretoDeLaAplicacion[0].nickname);

          this.Idpregunta = this.usuarioEnConcretoDeLaAplicacion[0].IdAsignacionDePregunta;
          // this.respuesta1 = this.usuarioEnConcretoDeLaAplicacion[0].respuesta;
          console.log(this.Idpregunta);
          // console.log(this.respuesta1);

          this.userService.obtenerLaPreguntaDefinitiva(this.Idpregunta)
            .subscribe(
              (data3) => { // Success

                this.pregunta = data3;
                this.IDMostrarLaPregunta = this.pregunta[0].id;
                this.MostrarLaPregunta = this.pregunta[0].pregunta;
                this.MostrarLaRespuesta = this.pregunta[0].respuesta;
                console.log(this.MostrarLaPregunta);
                console.log(this.MostrarLaRespuesta);
              },
              (error) => {
                console.error(error);
              }
            )

        },
        (error) => {
          console.error(error);
        }
      )
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JugarOnlinePage');
  }

  private crearFormularioEnviarRespuesta() {
    return this.formBuilder.group({
      respuesta: ['', Validators.required],
      icono: ['']
    });
  }

  guardarFormularioEnviarRespuestas() {
    console.log(this.formularioEnviarRespuestas.value);
    console.log(this.formularioEnviarRespuestas.value.respuesta);
    console.log(this.formularioEnviarRespuestas.value.icono);

    //rescato las respuestas y las formateo quitandole todas las comas
    this.arrayRespuestasCortadas = this.MostrarLaRespuesta.split(",");
    //console.log(this.arrayRespuestasCortadas);

    //valor del usuario introducido poniendolo todo en minusculas y sin acentos
    this.palabraDeUsuarioSinTilde = this.quitaAcentos(this.formularioEnviarRespuestas.value.respuesta.toLowerCase());
    //console.log(this.palabraDeUsuarioSinTilde);

    //recorro el array que me devuelve anteriormente y ahora recorriendolo las convierto en minusculas todas las mayusculas que se encuentra
    for (let i = 0; i < this.arrayRespuestasCortadas.length; i++) {

      this.palabraDEFINITIVASinTilde = this.quitaAcentos(this.arrayRespuestasCortadas[i].toLowerCase());
      console.log(this.palabraDEFINITIVASinTilde);

      for (let i = 0; i < this.arrayRespuestasUsuario.length; i++) {
        // console.log(this.arrayRespuestasUsuario[i].respuesta);

        if (this.arrayRespuestasUsuario[i].respuesta == this.palabraDeUsuarioSinTilde) {
          console.log("He salido del for y son iguales");
          this.controladorDeRepeticion = 1;
          break;
        } else if (this.arrayRespuestasUsuario[i].respuesta != this.palabraDeUsuarioSinTilde) {
          console.log("He salido del else if y NO son iguales");
          this.controladorDeRepeticion = 0;
        }

      }

      if (this.palabraDEFINITIVASinTilde == this.palabraDeUsuarioSinTilde && this.controladorDeRepeticion == 0) {
        this.formularioEnviarRespuestas.value.respuesta = this.palabraDeUsuarioSinTilde;
        this.formularioEnviarRespuestas.value.icono = "checkmark-circle";
        this.contadorPalabrasAcertadas += 1;
        // console.log("Llevas acertadas " + this.contadorPalabrasAcertadas + " palabra/s");
        // console.log("Has acertado la palabra");
        break;
      } else if (this.palabraDEFINITIVASinTilde != this.palabraDeUsuarioSinTilde && this.controladorDeRepeticion == 0) {
        this.formularioEnviarRespuestas.value.respuesta = this.palabraDeUsuarioSinTilde;
        this.formularioEnviarRespuestas.value.icono = "close-circle";
        // console.log("Has fallado la palabra");
      } else if (this.palabraDEFINITIVASinTilde == this.palabraDeUsuarioSinTilde && this.controladorDeRepeticion == 1
        || this.palabraDEFINITIVASinTilde != this.palabraDeUsuarioSinTilde && this.controladorDeRepeticion == 1) {
        this.controladorDeRepeticion = 0;
        this.formularioEnviarRespuestas.value.respuesta = this.palabraDeUsuarioSinTilde;
        this.formularioEnviarRespuestas.value.icono = "information-circle";
        console.log("Se ha repetido la palabra, losiento no contará en la puntuacion");
      }


    }

    this.arrayRespuestasUsuario.push(this.formularioEnviarRespuestas.value);

    // console.log(this.arrayRespuestasUsuario);

    this.formularioEnviarRespuestas = this.crearFormularioEnviarRespuesta();
    // this.arrayRespuestasUsuario.forEach(function (value) {
    //   console.log(value);
    // });

    // for (this.i = 0; i < arrayRespuestasUsuario.length; i++) {
    //   console.log(arrayRespuestasUsuario[i]);
    // }
  }

  quitaAcentos(palabra) {
    for (var i = 0; i < palabra.length; i++) {
      //Sustituye "á é í ó ú ñ ä ë ï ö ü" 
      if (palabra.charAt(i) == "á") palabra = palabra.replace(/á/, "a");
      if (palabra.charAt(i) == "é") palabra = palabra.replace(/é/, "e");
      if (palabra.charAt(i) == "í") palabra = palabra.replace(/í/, "i");
      if (palabra.charAt(i) == "ó") palabra = palabra.replace(/ó/, "o");
      if (palabra.charAt(i) == "ú") palabra = palabra.replace(/ú/, "u");
      if (palabra.charAt(i) == "ñ") palabra = palabra.replace(/ñ/, "n");
      if (palabra.charAt(i) == "ä") palabra = palabra.replace('ä', 'a');
      if (palabra.charAt(i) == "ë") palabra = palabra.replace('ë', 'e');
      if (palabra.charAt(i) == "ï") palabra = palabra.replace('ï', 'i');
      if (palabra.charAt(i) == "ö") palabra = palabra.replace('ö', 'o');
      if (palabra.charAt(i) == "ü") palabra = palabra.replace('ü', 'u');
    }
    return palabra;
  }


  ngOnInit() {
    // Para mostrar el tiempo que va retrocediendo
    this.intervalo2 = setInterval(() => {
      if (this.loadProgressTime <= 60) {
        this.loadProgressTime -= 1;
        // this.loadProgress -= 1.667;
        // console.log(this.loadProgressTime);
        // console.log(this.loadProgress);
      }
      if (this.loadProgress <= 100) {
        this.loadProgress -= 1.667;
        // console.log(this.loadProgress);
      }

      if (this.loadProgress == 3.313999999999922) {
        this.loadProgress = 1.667;
        // console.log("lo he puesto a 0"+this.loadProgress);
      }

      if (this.loadProgressTime <= 0) {
        // alert("Se ha terminado y has acertado" + this.contadorPalabrasAcertadas);
        clearInterval(this.intervalo2);
        // this.navCtrl.push(RondasPage);
        this.userService.getUsuarioDelMovilUsandoPorId(this.IDusuarioEnConcretoDeLaAplicacion)
          .subscribe(
            (data3) => { // Success

              this.usuarioEnConcretoDeLaAplicacion2 = data3;

              for (let i = 0; i < this.arrayRespuestasUsuario.length; i++) {

                console.log(this.arrayRespuestasUsuario[i]);

                if (i == this.arrayRespuestasUsuario.length - 1) {
                  this.RespuestasConvertidasEnString += this.arrayRespuestasUsuario[i].respuesta;
                  this.IconosConvertidasEnString += this.arrayRespuestasUsuario[i].icono;
                } else {
                  this.RespuestasConvertidasEnString += this.arrayRespuestasUsuario[i].respuesta + ",";
                  this.IconosConvertidasEnString += this.arrayRespuestasUsuario[i].icono + ",";
                }

              }
              console.log(this.RespuestasConvertidasEnString);
              console.log(this.IconosConvertidasEnString);

              this.userService.cambiarElEstadoDeConectadoDelUsuario(
                this.usuarioEnConcretoDeLaAplicacion2[0].id,
                this.usuarioEnConcretoDeLaAplicacion2[0].nickname,
                this.usuarioEnConcretoDeLaAplicacion2[0].imagenAsociada,
                this.usuarioEnConcretoDeLaAplicacion2[0].victoriasRondas,
                this.usuarioEnConcretoDeLaAplicacion2[0].derrotasRondas,
                this.usuarioEnConcretoDeLaAplicacion2[0].victoriaPorcentaje,
                this.usuarioEnConcretoDeLaAplicacion2[0].sala,
                this.usuarioEnConcretoDeLaAplicacion2[0].ocupado,
                this.usuarioEnConcretoDeLaAplicacion2[0].IdAsignacionDePregunta,
                this.contadorPalabrasAcertadas,
                this.RespuestasConvertidasEnString,
                this.IconosConvertidasEnString
              );


              JugarOnlinePage.intervaloTiempo = setTimeout(function () { JugarOnlinePage.instancia.codigoParaMandarloAResultadoFinal(); }, 3000);


            },
            (error) => {
              console.error(error);
            }
          )

      }
    }, 1000);

  }
  codigoParaMandarloAResultadoFinal() {
    this.navCtrl.pop();
    this.navCtrl.push(RondasPage, {
      IDusuarioEnConcretoDeLaAplicacion: this.IDusuarioEnConcretoDeLaAplicacion,
      IDUsuarioContrincante: this.IDUsuarioContrincante,
      IdSalaAsignadaEnConjunto: this.IdSalaAsignadaEnConjunto,
      IdDeLaPreguntaJugada: this.IDMostrarLaPregunta,
      LapreguntaQueSeHaJugadoEs: this.MostrarLaPregunta
    });
  }

  ngOnDestroy() {
    if (this.intervalo2) {
      clearInterval(this.intervalo2);
    }
  }

}


















// guardarFormularioEnviarRespuestas() {
//   console.log(this.formularioEnviarRespuestas.value);
//   console.log(this.formularioEnviarRespuestas.value.respuesta);
//   console.log(this.formularioEnviarRespuestas.value.icono);

//   //rescato las respuestas y las formateo quitandole todas las comas
//   this.arrayRespuestasCortadas = this.MostrarLaRespuesta.split(",");
//   //console.log(this.arrayRespuestasCortadas);


//   //valor del usuario introducido poniendolo todo en minusculas y sin acentos
//   this.palabraDeUsuarioSinTilde = this.quitaAcentos(this.formularioEnviarRespuestas.value.respuesta.toLowerCase());
//   //console.log(this.palabraDeUsuarioSinTilde);

//   //recorro el array que me devuelve anteriormente y ahora recorriendolo las convierto en minusculas todas las mayusculas que se encuentra
//   for (let i = 0; i < this.arrayRespuestasCortadas.length; i++) {
//     //valor sin quitarle la mayuscula
//     //console.log(this.arrayRespuestasCortadas[i]);
//     //valor ya poniendolo todo en minusculas
//     this.arrayRespuestasCortadas[i].toLowerCase();
//     // console.log(this.arrayRespuestasCortadas[i].toLowerCase());
//     //valor ya poniendolo todo en minusculas y sin acentos
//     this.palabraDEFINITIVASinTilde = this.quitaAcentos(this.arrayRespuestasCortadas[i].toLowerCase());
//     console.log(this.palabraDEFINITIVASinTilde);

//     for (let i = 0; i < this.arrayRespuestasUsuario.length; i++) {
//       // console.log(this.arrayRespuestasUsuario[i].respuesta);
//       if (this.arrayRespuestasUsuario[i].respuesta == this.formularioEnviarRespuestas.value.respuesta) {
//         console.log("He salido del for y son iguales");
//         this.controladorDeRepeticion = 1;
//       } else if (this.arrayRespuestasUsuario[i].respuesta != this.formularioEnviarRespuestas.value.respuesta) {
//         console.log("He salido del else if y NO son iguales");

//         this.controladorDeRepeticion = 0;
//       }

//     }

//     if (this.palabraDEFINITIVASinTilde == this.palabraDeUsuarioSinTilde && this.controladorDeRepeticion == 0) {
//       this.formularioEnviarRespuestas.value.icono = "checkmark-circle";
//       this.contadorPalabrasAcertadas += 1;
//       // console.log("Llevas acertadas " + this.contadorPalabrasAcertadas + " palabra/s");
//       // console.log("Has acertado la palabra");
//       break;
//     } else if (this.palabraDEFINITIVASinTilde != this.palabraDeUsuarioSinTilde && this.controladorDeRepeticion == 0) {
//       this.formularioEnviarRespuestas.value.icono = "close-circle";
//       // console.log("Has fallado la palabra");

//     } else if (this.palabraDEFINITIVASinTilde == this.palabraDeUsuarioSinTilde && this.controladorDeRepeticion == 1 ||
//       this.palabraDEFINITIVASinTilde != this.palabraDeUsuarioSinTilde && this.controladorDeRepeticion == 1) {
//       this.formularioEnviarRespuestas.value.icono = "information-circle";
//       console.log("Se ha repetido la palabra, losiento no contará en la puntuacion");

//     }


//   }

//   this.arrayRespuestasUsuario.push(this.formularioEnviarRespuestas.value);

//   // console.log(this.arrayRespuestasUsuario);

//   this.formularioEnviarRespuestas = this.crearFormularioEnviarRespuesta();
//   // this.arrayRespuestasUsuario.forEach(function (value) {
//   //   console.log(value);
//   // });

//   // for (this.i = 0; i < arrayRespuestasUsuario.length; i++) {
//   //   console.log(arrayRespuestasUsuario[i]);
//   // }
// }



// guardarFormularioEnviarRespuestas() {
//   // console.log(this.formularioEnviarRespuestas.value);
//   // console.log(this.formularioEnviarRespuestas.value.respuesta);
//   // console.log(this.formularioEnviarRespuestas.value.icono);

//   //valor del usuario introducido poniendolo todo en minusculas y sin acentos
//   // console.log('La ID de la pregunta es: '+this.IDMostrarLaPregunta);

//   this.palabraDeUsuarioSinTilde = this.quitaAcentos(this.formularioEnviarRespuestas.value.respuesta.toLowerCase());

//   // console.log(this.palabraDeUsuarioSinTilde);



//   this.userService.comprobarPalabraIntroducida(this.IDMostrarLaPregunta, this.palabraDeUsuarioSinTilde)
//     .subscribe(
//       (data20) => { // Success
//         this.comprobacionDePalabra = data20;
//         console.log(this.comprobacionDePalabra);
//         let controlador = 0;

//         if (this.comprobacionDePalabra == "0") {
//           this.formularioEnviarRespuestas.value.icono = "close-circle";

//         } else if(this.comprobacionDePalabra == this.palabraDeUsuarioSinTilde){
//           this.formularioEnviarRespuestas.value.icono = "checkmark-circle";
//           this.contadorPalabrasAcertadas += 1;
//           console.log("Llevas acertadas " + this.contadorPalabrasAcertadas + " palabra/s");
//         }

//         this.arrayRespuestasUsuario.push(this.formularioEnviarRespuestas.value);
//         console.log(this.arrayRespuestasUsuario);

//         this.formularioEnviarRespuestas = this.crearFormularioEnviarRespuesta();

//       },
//       (error) => {
//         console.error(error);
//       }
//     )

// }