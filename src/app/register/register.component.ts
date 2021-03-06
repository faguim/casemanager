import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash';

import { ApiService } from './../api.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-register',
  changeDetection: ChangeDetectionStrategy.OnPush,

  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  caseForm: FormGroup;

  targetStates: FormArray;

  public resources: FormArray;

  addResources(label, uri) {
    this.resources.push(this.formBuilder.group({
      label: [label],
      uri: [uri]
    }));
  }

  addState() {
    let statesForm = this.caseForm.get('states') as FormArray;
    let title;
    if (statesForm.length == 0)
      title = 'Start'
    else title = 'State ' + (statesForm.length + 1)

    statesForm.push(this.createState(title));
  }

  createState(title): FormGroup {
    return this.formBuilder.group({
      ident: [(<FormArray>this.caseForm.get('states')).length],
      title: [title],
      description: this.formBuilder.group({
        value: ['', Validators.required],
        concepts: this.formBuilder.array([]),
      }),
      feedback: this.formBuilder.group({
        value: ['', Validators.required],
        concepts: this.formBuilder.array([]),
      }),
      actions: this.formBuilder.array([])
    });
  }

  addAction(i) {
    let statesCtrl = this.caseForm.get('states') as FormArray;

    var actions = statesCtrl.at(i).get('actions') as FormArray;
    let action = this.createAction();

    action.get('proceed').valueChanges.subscribe(
      () => {
        action.get('target').setValidators(this.validateTarget);
        action.get('target').updateValueAndValidity();
      }
    )
    actions.push(action);

  }

  createAction(): FormGroup {
    return this.formBuilder.group({
      text: ['', Validators.required],
      correct: [false],
      proceed: [true],
      target: ['', this.validateTarget]
    });
  }

  ngOnInit() {
    this.caseForm = this.formBuilder.group(
      {
        name: this.formBuilder.group({
          value: ['', Validators.required],
          concepts: this.formBuilder.array([]),
        }),
        won_text: ['Congratulations, you won!'],
        lost_text: ['Game over: you lost! :('],
        randomize_actions: [true],
        allow_negative_score: [true],
        timeout: [10],
        states: this.formBuilder.array([])
      }
    );
    this.resources = this.formBuilder.array([]);
  }

  onSubmit() {
    if (!this.caseForm.valid) {
      this.verifyValidation(this.caseForm);
      console.log(this.caseForm.value)
      this.api.save(this.caseForm.value).subscribe(
        (res) => {
          console.log('foi');
        },
        (err) => {
          console.error('ApiService::handleError', err);
        }
      );
    }
  }

  public removeTabHandler(state: any): void {
    // this.medicalcase.questions.splice(this.medicalcase.questions.indexOf(question), 1);
    console.log('Remove Tab handler');
  }


  showActions(i) {
    if ((<FormArray>this.caseForm.get('states')).at(i).get('actions').value.length > 0)
      return true;
    else return false
  }

  // Validation
  verifyValidation(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsDirty();
      if (control instanceof FormGroup) {
        this.verifyValidation(control);
      }
      if (control instanceof FormArray) {
        Object.keys(control.controls).forEach(field => {
          let c1 = control.get(field);
          this.verifyValidation(<FormGroup>c1);
        })
      }
    });
  }

  public applyCssError(i, j, parent, field) {
    let control = this.caseForm.get(field);

    if (parent == 'state') {
      let control = (<FormArray>this.caseForm.get('states')).at(i).get(field);
      return {
        'has-error': this.verifyValidTouched(i, '', parent, field),
        'has_feeddback': this.verifyValidTouched(i, '', parent, field)
      }
    }

    if (parent == 'action') {
      let stateControl = (<FormArray>this.caseForm.get('states')).at(i);

      let actionsControl = (<FormArray>stateControl.get('actions')).at(j).get(field);
      return {
        'has-error': this.verifyValidTouched(i, j, parent, field),
        'has_feeddback': this.verifyValidTouched(i, j, parent, field)
      }
    }
    if (control instanceof FormControl) {
      return {
        'has-error': this.verifyValidTouched('', '', '', field),
        'has_feeddback': this.verifyValidTouched('', '', '', field)
      }
    }
  }

  verifyValidTouched(i, j, parent, field) {
    if (parent == "")
      return !this.caseForm.get(field).valid && (this.caseForm.get(field).touched || this.caseForm.get(field).dirty);
    else {
      if (parent == 'states') {
        let arrayControl = this.caseForm.get(parent) as FormArray;
        var state = arrayControl.at(i);
        return !state.get(field).valid && (state.get(field).touched || state.get(field).dirty);
      }
      if (parent == 'actions') {
        let actionsArray = (<FormArray>(<FormArray>this.caseForm.get('states')).at(i).get('actions'))
        var action = actionsArray.at(j);
        return !action.get(field).valid && (action.get(field).touched || action.get(field).dirty);
      }
    }
  }

  verifyValidTouchedGroup(fields) {

    for (var i in fields) {
      let field = fields[i];
      if (!this.caseForm.get(field).valid && (this.caseForm.get(field).touched || this.caseForm.get(field).dirty)) {
        return true;
      }
    }
  }

  validateTarget(c: FormControl) {
    if (c.parent) {
      if (c.parent.get('proceed').value == true && c.value == "") {
        return {
          valid: false
        }
      } else return null;

    }
  }

  // Validation
  getStates() {
    return (<FormArray>this.caseForm.get('states')).controls;
  }

  fulfillStates(i) {
    let allStates = _.cloneDeep(<FormArray>this.caseForm.get('states'));
    this.targetStates = _.cloneDeep(allStates);
    this.targetStates.removeAt(i)
  }

  getOntologyResources(element, field, index) {
    element.visible = true;
    // this.resources = this.formBuilder.array([]);
    let control = this.getControl(this.caseForm, field, index);
    let concepts = control.get("concepts") as FormArray;

    Object.keys(concepts.controls).forEach(i => {
      concepts.removeAt(0);
    });

    this.api.getOntologyResources(element.value).subscribe(
      (res) => {
        element.visible = false;
        Object.keys(res).forEach(i => {
          concepts.push(this.formBuilder.group({
            label: [res[i].label],
            uri: [res[i].uri]
          }));
          this.cd.markForCheck();
        });
      },
      (err) => {
        console.error('ApiService::handleError', err);
      }
    );
  }

  concepts;
  getConcepts(control, name, i) {
    if (control == ''){
      control = this.caseForm;
    }
    let matched = false;
    
    Object.keys(control.controls).forEach(key => {
      if (!matched){
        let innerControl = control.get(key);
        if (key == name){
          matched = true;
          return this.concepts = innerControl.get('concepts').controls;
        }
        if (innerControl instanceof FormGroup) {
          return this.getConcepts(innerControl, name, i)
        }
        if (innerControl instanceof FormArray) {
          let eachElementArray = innerControl.at(i);
          if (eachElementArray){
            return this.getConcepts(innerControl.at(i), name, i)
          }
        }
      }
    });
    return this.concepts;
  }

  outputControl;
  getControl(inputControl, controlName, index){
    let matched = false;
    
    Object.keys(inputControl.controls).forEach(key => {
      if (!matched){
        
        if (key == controlName){
          matched = true;
          return this.outputControl = inputControl.get(controlName);
        }
        let innerControl = inputControl.get(key);
        if (innerControl instanceof FormGroup) {
          return this.getControl(innerControl, controlName, index)
        }
        if (innerControl instanceof FormArray) {
          let elementArray = innerControl.at(index);
          if (elementArray){
            return this.getControl(elementArray, controlName, index)
          }
        }
      }
    });      
    return this.outputControl;
  }

  chooseResource(name) {

  }

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef) {
  }
}

