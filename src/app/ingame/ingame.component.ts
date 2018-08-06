import { Component, OnInit } from '@angular/core';
import { card } from '../card';

@Component({
  selector: 'app-ingame',
  templateUrl: './ingame.component.html',
  styleUrls: ['./ingame.component.css']
})
export class IngameComponent implements OnInit {
  Suits: string[] = ['D','H','S','C'];
  Rank: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13];

  Deck: card[] = [];
  WastePile: card[] = [];
  Maneuver: card[][] = [ [], [], [], [], [], [], [] ];
  Foundation: card[][] = [ [], [], [], [] ];
  toWaste: card[] = [];
  Source: string = "";
  Destination: string = "";
  moved: boolean = false;

  constructor() {
    this.createDeck();
    this.shuffleDeck(this.Deck);
    this.setManeuver();
  }

  createDeck() {
    for (var i = 0; i < this.Suits.length; i++) {
      for ( var ii = 0; ii < this.Rank.length; ii++) {
        this.Deck.push({suit: this.Suits[i], rank: this.Rank[ii], face: false})
      }
    }
  }

  shuffleDeck(array) {
      var arrayLength = array.length, temp, index;
      while (arrayLength) {
        index = Math.floor(Math.random() * arrayLength--);

        temp = array[arrayLength];
        array[arrayLength] = array[index];
        array[index] = temp;
      }
      return array;
  }

  setManeuver() {
    for(var i = 0; i < 7; i++) {
      for(var ii = i; ii < 7; ii++) {
        this.Maneuver[ii][i] = this.Deck.shift();
         if(i == ii) {
          this.Maneuver[ii][i].face = true;
        } 
      }
    }
  }

  drawTalon() {
    if (this.Deck.length >= 3) {
      for(var i = 0; i < 3; i++) {
        this.toWaste.push(this.Deck.shift());
      }
      for(var i = 0; i < 3; i++){
        this.WastePile.unshift(this.toWaste.pop());
        this.WastePile[0].face = true;
      }
    }
    else if(this.Deck.length > 0) {
      var ii = this.Deck.length;
      for(var i = 0; i < ii; i++) {
        this.toWaste.push(this.Deck.shift());
      }
      for(var i = 0; i < ii; i++){
        this.WastePile.unshift(this.toWaste.pop());
        this.WastePile[0].face = true;
      }
    }
    else {
      while(this.WastePile.length) {
        if(this.WastePile.length >= 3) {
          var toTalon = [];
          for(var i = 0; i < 3; i++){
            toTalon.unshift(this.WastePile.pop());
          }
          for(var i = 0; i < 3; i++){
            this.Deck.push(toTalon.shift());
          }
        }
        else {
          var toTalon = [];
          var ii = this.WastePile.length;
          for(var i = 0; i < ii; i++){
            toTalon.unshift(this.WastePile.pop());
          }
          for(var i = 0; i < ii; i++){
            this.Deck.push(toTalon.shift());
          }
        }
      }
    }
  }

  validateMove(from, fromLoc, to, toLoc, index) {
    if(fromLoc == 'M'){
      if(toLoc == 'M') {
        if(!this.Maneuver[to].length) {
          if(this.Maneuver[from][index].rank == 13) {
            this.moveCard(from, fromLoc, to, toLoc, index);
          }
        }
        else if(((this.Maneuver[from][index].suit == 'D' || this.Maneuver[from][index].suit == 'H') &&
        (this.Maneuver[to][this.Maneuver[to].length-1].suit == 'S' || this.Maneuver[to][this.Maneuver[to].length-1].suit == 'C')) || 
        ((this.Maneuver[from][index].suit == 'S' || this.Maneuver[from][index].suit == 'C') &&
        (this.Maneuver[to][this.Maneuver[to].length-1].suit == 'D' || this.Maneuver[to][this.Maneuver[to].length-1].suit == 'H'))) {
          if(this.Maneuver[to][this.Maneuver[to].length-1].rank - 1 == this.Maneuver[from][index].rank) {
          this.moveCard(from, fromLoc, to, toLoc, index);
          }
        }
      }
      else if(toLoc == 'F') {
        if(!this.Foundation[to].length) {
          if(this.Maneuver[from][this.Maneuver[from].length-1].rank == 1) {
            this.moveCard(from, fromLoc, to, toLoc, index);
          }
        }
        else {
          if(this.Maneuver[from][this.Maneuver[from].length-1].suit == this.Foundation[to][0].suit) {
            if(this.Maneuver[from][this.Maneuver[from].length-1].rank - 1 == this.Foundation[to][this.Foundation[to].length-1].rank) {
              this.moveCard(from, fromLoc, to, toLoc, index);
              }
          }
        } 
      }
    }
    else if(fromLoc == 'W') {
      if(toLoc == 'M') {
        if(!this.Maneuver[to].length) {
          if(this.WastePile[0].rank == 13) {
            this.moveCard(from, fromLoc, to, toLoc, index);
          }
        }
        else if(((this.WastePile[0].suit == 'D' || this.WastePile[0].suit == 'H') &&
        (this.Maneuver[to][this.Maneuver[to].length-1].suit == 'S' || this.Maneuver[to][this.Maneuver[to].length-1].suit == 'C')) ||
        ((this.WastePile[0].suit == 'S' || this.WastePile[0].suit == 'C') &&
        (this.Maneuver[to][this.Maneuver[to].length-1].suit == 'D' || this.Maneuver[to][this.Maneuver[to].length-1].suit == 'H'))) {
          if(this.Maneuver[to][this.Maneuver[to].length-1].rank - 1 == this.WastePile[0].rank)
            this.moveCard(from, fromLoc, to, toLoc, index);
        }
      }
      else if(toLoc == 'F') {
        if(!this.Foundation[to].length) {
          if(this.WastePile[0].rank == 1) {
            this.moveCard(from, fromLoc, to, toLoc, index);
          }
        }
        else {
          if(this.WastePile[0].suit == this.Foundation[to][0].suit) {
            if(this.WastePile[0].rank - 1 == this.Foundation[to][this.Foundation[to].length-1].rank) {
              this.moveCard(from, fromLoc, to, toLoc, index);
              }
          }
        }
      }
    }
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev) {
    //ev.dataTransfer.setData("text", ev.target.id);
    this.Source = ev.target.id;
    this.moved = false;
  }

  drop(ev) {
    ev.preventDefault();
    //var data = ev.dataTransfer.getData("text");
    //ev.target.appendChild(document.getElementById(data));
    this.Destination = ev.target.id;
    if(this.Source != this.Destination) {
      this.validateMove(this.Source.charAt(1),this.Source.charAt(0),this.Destination.charAt(1),this.Destination.charAt(0),this.Source.charAt(2));
    }
  }

  moveCard(from, fromLoc, to, toLoc, index) {
    if(fromLoc == 'M') {
      if(toLoc == 'M') {
        var count = 0;
        for(var i = 0; i < this.Maneuver[from].length; i++) {
          if(this.Maneuver[from][i].face) {
            this.Maneuver[to].push(this.Maneuver[from][i]);
            count++;
          }
        }
        for(var i = 0; i < count; i++) {
          this.Maneuver[from].pop();
        }
      }
      else if(toLoc == 'F') {
        this.Foundation[to].push(this.Maneuver[from].pop());
      }
    }
    else if (fromLoc == 'W') {
      if(!this.moved) {
        this.moved = true;
        if(toLoc == 'M') {
          this.Maneuver[to].push(this.WastePile.shift());
        }
        else if(toLoc == 'F') {
          this.Foundation[to].push(this.WastePile.shift());
        }
      }
    }
  }

  flip(ev) {
    if(!this.Maneuver[ev.target.id][this.Maneuver[ev.target.id].length-1].face) {
      this.Maneuver[ev.target.id][this.Maneuver[ev.target.id].length-1].face = true;
    }
  }

  ngOnInit() {

  }

}
