#!/usr/bin/perl
use strict;
use warnings;

use JSON qw( decode_json);
use Data::Dumper;

my $in_file = "test.json"; 
#"Movie_genres_transfered.json";
my $out_file = "test.csv";

if (! $in_file) {
	die "Sorry, but can not find this file\n";
}

unless (open(INFILE, "<", $in_file)) {
	die "Can't open file", $in_file, " ", $!;
}

unless (open(OUTFILE, ">", $out_file)) {
	die "Can't open file", $out_file, " for writing". $!;
};

my @arr = <INFILE>;
my $size = @arr;

print OUTFILE "id", ",genres", "\n";
for (my $i = 0; $i < $size; $i++) {
	chomp $arr[$i];
	my $parse = decode_json ($arr[$i]);
	my @genres =@{$parse->{'genres'}};
	print OUTFILE $parse->{'id'}, ",";
	foreach(@genres) {
		print OUTFILE $_, ",";
	}
	print OUTFILE "\n";
}
