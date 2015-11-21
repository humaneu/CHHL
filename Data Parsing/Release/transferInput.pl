#!/usr/bin/perl
use strict;
use warnings;
use diagnostics;

my $in_file = "Release.json";
my $out_file = "Release_transfered.json";

if (! $in_file){
      die "Sorry, but can not find this file\n";
}

unless (open(INFILE, "<", $in_file)){
	die "Can't open file" , $in_file , " " , $!;
}

unless (open(OUTFILE, ">", $out_file)){
      	die "Can't open file", $out_file, "for writing", $!;
}

my @arr = <INFILE>;
my $size=@arr;

for (my $i=0; $i < $size; $i++){
	chomp $arr[$i];
#	$arr[$i] =~ s/\t//g;
    if ($arr[$i] =~ m/^}/){
        print OUTFILE $arr[$i],",\n";
    } else {
        print OUTFILE $arr[$i];
    }
}
#