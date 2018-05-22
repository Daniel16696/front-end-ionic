import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { TabsPage } from '../tabs/tabs';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the InicioDelJuegoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inicio-del-juego',
  templateUrl: 'inicio-del-juego.html',
})
export class InicioDelJuegoPage {

  nicknameUsuario: FormGroup;
  users: any;
  unclickSolamente: any = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public userService: UserServiceProvider, public alertCtrl: AlertController) {
    this.nicknameUsuario = this.crearNicknameUsuario();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InicioDelJuegoPage');
  }

  guardarNicknameUsuario() {
    if (this.unclickSolamente == false) {
      this.userService.getUsuarioDelMovilUsando(this.nicknameUsuario.value.nickname)
        .subscribe(
          (data) => { // Success
            this.users = data;
            console.log(this.users);

            if (this.users.length == 1) {
              let alert = this.alertCtrl.create({
                title: 'Este usuario ya existe',
                subTitle: 'Introduzca otro nickname',
                buttons: ['Ok']
              });
              alert.present();

              this.nicknameUsuario = this.crearNicknameUsuario();
            } else {

              if (this.unclickSolamente == false) {
                this.unclickSolamente == true;
                this.userService.postDatos(this.nicknameUsuario.value.nickname);
                console.log(this.nicknameUsuario.value.nickname);
                window.localStorage['nickUsuarioAplicacion'] = this.nicknameUsuario.value.nickname;
                this.navCtrl.push(TabsPage);
              }
            }


          },
          (error) => {
            console.error(error);

          }
        )
    }

  }


  // guardarNicknameUsuario() {
  //   let detectarBoolean = false;
  //   if (this.unclickSolamente == false) {

  //     this.userService.getUsers()
  //       .subscribe(
  //         (data) => { // Success
  //           this.users = data;
  //           console.log(data);

  //           for (let i = 0; i < this.users.length; i++) {
  //             console.log(i);
  //             console.log(this.users[i].nickname);

  //             if (this.users[i].nickname == this.nicknameUsuario.value.nickname) {
  //               // alert("Este usuario existe ya, porfavor introduce otro nickname");
  //               let alert = this.alertCtrl.create({
  //                 title: 'Este usuario ya existe',
  //                 subTitle: 'Introduzca otro nickname',
  //                 buttons: ['Ok']
  //               });
  //               alert.present();
  //               console.log("Hemos salido");
  //               detectarBoolean = true;
  //             }
  //           }
  //           console.log("Hemos salido del for");
  //           if (detectarBoolean == false && this.unclickSolamente == false) {
  //             this.unclickSolamente == true;
  //             console.log("He creado el usuario");
  //             this.userService.postDatos(this.nicknameUsuario.value.nickname);
  //             console.log(this.nicknameUsuario.value.nickname);
  //             window.localStorage['nickUsuarioAplicacion'] = this.nicknameUsuario.value.nickname;
  //             this.navCtrl.push(TabsPage);
  //           }

  //         },
  //         (error) => {
  //           console.error(error);
  //         }
  //       )

  //   }
  // }

  private crearNicknameUsuario() {
    return this.formBuilder.group({
      nickname: ['', Validators.required],
    });
  }
}
